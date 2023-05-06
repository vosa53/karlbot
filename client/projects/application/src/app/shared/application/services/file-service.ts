import { Injectable } from "@angular/core";

/**
 * File system service.
 */
@Injectable({
    providedIn: "root"
})
export class FileService {
    /**
     * Saves a file.
     * @param file File to save.
     */
    save(file: File): Promise<void> {
        return new Promise(resolve => {
            const url = URL.createObjectURL(file);

            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            link.click();
    
            URL.revokeObjectURL(url);
            resolve();
        });
    }

    /**
     * Opens a user specified file.
     * @returns Opened file.
     */
    open(): Promise<File | null> {
        return new Promise(resolve => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.click();

            fileInput.addEventListener("change", () => resolve(fileInput.files?.length === 1 ? fileInput.files.item(0) : null));
        });
    }
}
