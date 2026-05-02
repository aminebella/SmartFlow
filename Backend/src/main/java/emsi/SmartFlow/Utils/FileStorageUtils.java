package emsi.SmartFlow.Utils;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

public class FileStorageUtils {

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public static String saveFile(MultipartFile file, String subFolder) throws IOException {
        if (file == null || file.isEmpty()) return null;

        // créer le dossier si n'existe pas
        Path folderPath = Paths.get(UPLOAD_DIR + subFolder);
        Files.createDirectories(folderPath);

        // nom unique pour éviter les conflits
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = folderPath.resolve(filename);

        // sauvegarder le fichier
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // retourner le path relatif à sauvegarder en DB
        return "/uploads/" + subFolder + "/" + filename;
    }

    public static void deleteFile(String filePath) throws IOException {
        if (filePath == null) return;
        Path path = Paths.get("src/main/resources/static" + filePath);
        Files.deleteIfExists(path);
    }
}