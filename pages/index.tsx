import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { Parser as GMODParser } from "@gmod/binary-parser";
import { Parser as BinaryParser } from "binary-parser";

export default function Home() {
  useEffect(() => {
    const ipHeader1 = new GMODParser().uint8("compressionMethod", {
      formatter: (b: any) => {
        const method = ["raw"][b];
        if (!method) {
          // never gets here
          console.log("in @gmod/binary-parser");
        }
        return method;
      },
    });
    const ipHeader2 = new BinaryParser().uint8("compressionMethod", {
      formatter: (b: any) => {
        const method = ["raw"][b];
        if (!method) {
          console.log("in binary-parser");
        }
        return method;
      },
    });

    console.log({ ipHeader1, ipHeader2 });

    // wouldn't actually parse correctly, just shows minification crash
    const buf = Buffer.from("450002c5939900002c06ef98adc24f6c850186d1", "hex");
    console.log(ipHeader2.parse(buf));
    console.log(ipHeader1.parse(buf));
  }, []);
  return <div className={styles.container}>hello</div>;
}
