export class FileNameHelper {
  public getFileName(type: string, data: string, file: File): string {
    const extension = file.name.split('.').pop();
    return `${type}-${data}-${Math.random().toString(36).substring(4)}.${extension}`;
  }

  public getRealFileName(str: string): string {
    const index = str.indexOf('-');
    if (index !== -1) {
        return str.substring(index + 1);
    }
    return str;
  }
}
