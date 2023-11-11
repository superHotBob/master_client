import fs from "fs";
import { Formidable } from 'formidable';
const sharp = require('sharp');

export async function POST(req, res) {
    const form = new Formidable();
    form.parse(req, function (err, fields, files) {

        const oldpath = files.file[0].filepath

        const file = files.file[0]  
      
        const newpath = '../../data/images/' + 10 + files.file[0].originalFilename;
        const newpath_1 = '../../data/images/' + files.file[0].originalFilename;
        fs.rename(oldpath, newpath, async function (err) {
            if (err) throw err;
            const metadata = await sharp(newpath).metadata();
            const ratio = (metadata.width/metadata.height).toFixed(2);
            sharp(newpath)
            .resize(500, 500/ratio)
            .toFile(newpath_1, function(err){

                fs.unlink(newpath, async (err) => {
                    if (err) {
    
                        console.log('Ошибка записи изображения');
                    }
                });    

            });
           
        res.write('File uploaded and moved!');
        res.end();
    });
    res.write('File uploaded');
    res.end();
});

res.send('Файл загружен');

}
export default POST;
export const config = {
    api: {
        bodyParser: false,
    },
};