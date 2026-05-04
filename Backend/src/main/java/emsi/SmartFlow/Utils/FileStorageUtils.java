package emsi.SmartFlow.Utils;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

public class FileStorageUtils {

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public static String saveFile(MultipartFile file, String subFolder) throws IOException {
        if (file == null || file.isEmpty()) return null;

        // ─── 1. Validation extension ──────────────────────────
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Nom de fichier invalide");
        }
        String extension = originalFilename.toLowerCase();
        boolean validExtension = extension.endsWith(".png") ||
                extension.endsWith(".jpg") ||
                extension.endsWith(".jpeg") ||
                extension.endsWith(".webp");
        if (!validExtension) {
            throw new IllegalArgumentException("Format non accepté. Utilisez : JPG, PNG, WEBP");
        }

        // ─── 2. Validation ContentType (double sécurité) ──────
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit être une image");
        }

        // ─── 3. Validation taille : max 2MB ───────────────────
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new IllegalArgumentException("L'image ne doit pas dépasser 2MB");
        }
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