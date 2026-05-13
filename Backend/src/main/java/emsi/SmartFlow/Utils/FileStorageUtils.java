package emsi.SmartFlow.Utils;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

public class FileStorageUtils {

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public static String saveFile(MultipartFile file, String subFolder) throws IOException {
        // créer le dossier si n'existe pas
        Path folderPath = Paths.get(UPLOAD_DIR + subFolder);
        Files.createDirectories(folderPath);

        // nom unique pour éviter les conflits
        // FIX: Use only UUID as filename, ignore original filename entirely (path traversal fix)
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            String rawExt = originalFilename.substring(originalFilename.lastIndexOf("."));
            // FIX: Sanitize extension — only allow alphanumeric chars
            extension = rawExt.replaceAll("[^a-zA-Z0-9.]", "");
        }
        String filename = UUID.randomUUID() + extension;

        // FIX: Resolve against the folder and verify the result stays inside it
        Path filePath = folderPath.resolve(filename).normalize();
        if (!filePath.startsWith(folderPath.normalize())) {
            throw new IOException("Invalid file path detected");
        }

        // sauvegarder le fichier
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // retourner le path relatif à sauvegarder en DB
        return "/uploads/" + subFolder + "/" + filename;
    }

    public static void deleteFile(String filePath) throws IOException {
        if (filePath == null || filePath.isBlank()) return;   // also handles blank

        // FIX: Normalize and validate path stays within static dir
        Path base = Paths.get("src/main/resources/static").normalize();
        Path path = base.resolve(filePath.startsWith("/") ? filePath.substring(1) : filePath).normalize();
        if (!path.startsWith(base)) {
            throw new IOException("Invalid file path detected");
        }

        Files.deleteIfExists(path);
    }
}