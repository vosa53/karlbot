import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../api-base-url';
import { User } from '../models/user';
import { ApiService } from './api-service';

@Injectable({
    providedIn: 'root'
})
export class FileService {
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

    open(): Promise<File | null> {
        return new Promise(resolve => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.click();

            fileInput.addEventListener("change", () => resolve(fileInput.files?.length === 1 ? fileInput.files.item(0) : null));
        });
    }
}
