export interface Config {
    color: string;
    pageSize: string;
    orientation: string;
    pagesToPrint: string;
    sided: string;
    copies: number;
    remarks: string;
    specificRange: string;
    totalPrice: number;
  };

export interface FileWithConfig{
    file: File;
    config: Config;
}