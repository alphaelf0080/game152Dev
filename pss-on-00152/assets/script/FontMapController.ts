import { Data } from './DataController';

export class FontMapController {  //對照ASCII碼順序
    BasicFont: { [key: string]: string } = {
        '0': 'AB', '1': 'CD', '2': 'EF', '3': 'GH', '4': 'IJ',
        '5': 'KL', '6': 'MN', '7': 'OP', '8': 'QR', '9': 'ST',
    }

    BasicSymbol() {
        this.BasicFont["."] = "U";
        this.BasicFont[","] = "V";
    }

    BasicInit() {  //一般只有數字和標點符號的字體
        this.BasicSymbol();

        return this.BasicFont;
    }

    WildNumInit() {  //Wild的數字
        this.BasicSymbol();

        this.BasicFont["K"] = "WXY";
        this.BasicFont["M"] = "Z[\\";
        this.BasicFont["B"] = "]^_";

        return this.BasicFont;
    }

    BannerNumInit() {  //Banner的數字
        this.BasicSymbol();

        if(Data.Library.RES_LANGUAGE === "tai"){
            this.BasicFont["w"] = "WXYZ[\\]^";
            this.BasicFont["t"] = "_`abcde";
        }
        else if(Data.Library.RES_LANGUAGE === "eng" || Data.Library.RES_LANGUAGE === "ind" || Data.Library.RES_LANGUAGE === "sch" || Data.Library.RES_LANGUAGE === "vie") {
            this.BasicFont["w"] = "WXYZ[\\";
            this.BasicFont["t"] = "]^_`abcd";
        }else if(Data.Library.RES_LANGUAGE === "tch" || Data.Library.RES_LANGUAGE === "por") {
            this.BasicFont["w"] = "WXYZ[\\]";
            this.BasicFont["t"] = "^_`abcde";
        }else {
            this.BasicFont["w"] = "WXYZ[\\";
            this.BasicFont["t"] = "]^_`abc";
        }

        return this.BasicFont;
    }

    ComboNumInit() {  //Combo的數字
        if (Data.Library.RES_LANGUAGE === "tch" || Data.Library.RES_LANGUAGE === "sch") {
            this.BasicFont["s"] = "UVWXYZ";
        } else {
            this.BasicFont["s"] = 'UVWXYZ[\\';
        }

        return this.BasicFont;
    }

    SlotWinNumInit() {  //出現在滾輪框中間的WinNum
        this.BasicSymbol();
        return this.BasicFont;
    }

    MultipleNumInit() {  //倍率數字
        this.BasicFont["x"] = "UVW";

        return this.BasicFont;
    }

    TransToFontString(num: number) {
        let NumberString = num.toString();
        let ReturnString = "";
        for (let i = 0; i < NumberString.length; i++) {
            ReturnString += this.BasicFont[NumberString[i]];
        }
        return ReturnString;
    }
}

