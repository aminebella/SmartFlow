package emsi.SmartFlow.TestUnitaire.Utils;

import emsi.SmartFlow.Utils.FileStorageUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mockito;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileStorageUtilsTest {

    // ─── deleteFile tests ────────────────────────────────────────────────────

    @Test
    void deleteFile_nullPath_doesNotThrow() {
        assertDoesNotThrow(() -> FileStorageUtils.deleteFile(null));
    }

    @Test
    void deleteFile_blankPath_doesNotThrow() {
        assertDoesNotThrow(() -> FileStorageUtils.deleteFile("   "));
    }

    @Test
    void deleteFile_nonExistentPath_doesNotThrow(@TempDir Path tempDir) {
        String fakePath = "/non/existent/file.jpg";
        assertDoesNotThrow(() -> FileStorageUtils.deleteFile(fakePath));
    }

    @Test
    void deleteFile_pathTraversalAttempt_throwsIOException() {
        // path trying to escape the static directory
        assertThrows(IOException.class,
                () -> FileStorageUtils.deleteFile("../../etc/passwd"));
    }

    // ─── saveFile tests ──────────────────────────────────────────────────────

    @Test
    void saveFile_validFile_returnsRelativePath() throws IOException {
        MultipartFile mockFile = Mockito.mock(MultipartFile.class);
        Mockito.when(mockFile.getOriginalFilename()).thenReturn("photo.jpg");
        Mockito.when(mockFile.getInputStream())
                .thenReturn(new ByteArrayInputStream("fake-image-content".getBytes()));

        String result = FileStorageUtils.saveFile(mockFile, "images");

        assertNotNull(result);
        assertTrue(result.startsWith("/uploads/images/"));
        assertTrue(result.endsWith(".jpg"));
    }

    @Test
    void saveFile_filenameWithNoExtension_returnsPathWithoutExtension() throws IOException {
        MultipartFile mockFile = Mockito.mock(MultipartFile.class);
        Mockito.when(mockFile.getOriginalFilename()).thenReturn("fileWithNoExtension");
        Mockito.when(mockFile.getInputStream())
                .thenReturn(new ByteArrayInputStream("data".getBytes()));

        String result = FileStorageUtils.saveFile(mockFile, "docs");

        assertNotNull(result);
        assertTrue(result.startsWith("/uploads/docs/"));
    }

    @Test
    void saveFile_nullOriginalFilename_doesNotThrow() throws IOException {
        MultipartFile mockFile = Mockito.mock(MultipartFile.class);
        Mockito.when(mockFile.getOriginalFilename()).thenReturn(null);
        Mockito.when(mockFile.getInputStream())
                .thenReturn(new ByteArrayInputStream("data".getBytes()));

        assertDoesNotThrow(() -> FileStorageUtils.saveFile(mockFile, "misc"));
    }

    @Test
    void saveFile_pathTraversalInFilename_doesNotEscapeFolder() throws IOException {
        MultipartFile mockFile = Mockito.mock(MultipartFile.class);
        // attacker tries to inject ../ in the filename
        Mockito.when(mockFile.getOriginalFilename()).thenReturn("../../etc/passwd.jpg");
        Mockito.when(mockFile.getInputStream())
                .thenReturn(new ByteArrayInputStream("data".getBytes()));

        String result = FileStorageUtils.saveFile(mockFile, "images");

        // result must stay inside /uploads/images/
        assertTrue(result.startsWith("/uploads/images/"));
    }

    @Test
    void saveFile_maliciousExtension_isSanitized() throws IOException {
        MultipartFile mockFile = Mockito.mock(MultipartFile.class);
        Mockito.when(mockFile.getOriginalFilename()).thenReturn("file.<script>.jpg");
        Mockito.when(mockFile.getInputStream())
                .thenReturn(new ByteArrayInputStream("data".getBytes()));

        String result = FileStorageUtils.saveFile(mockFile, "images");

        assertFalse(result.contains("<"));
        assertFalse(result.contains(">"));
    }
}