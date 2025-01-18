export interface Config {
    color: "color" | "b&w";
    pageSize: string;
    orientation: "portrait" | "landscape";
    pagesToPrint: "all" | "specific";
    sided: "single" | "double";
    copies: number;
    remarks: string;
    specificRange: string;
    totalPrice:number;
  };

export interface FileWithConfig{
    file: File;
    config: Config;
}