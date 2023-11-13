import fs from "fs";
import { Formidable } from 'formidable';
const sharp = require('sharp');

export async function POST(req, res) {
    const form = new Formidable();
    form.parse(req, function (err, fields, files) {

        const oldpath = files.file[0].filepath

        const file = files.file[0]
        

        const newpath = '../../data/images/' + 10 + files.file[0].originalFilename;
        const newpath_1 = '../../data/images/' + fields.name[0] + '.jpg';
        fs.rename(oldpath, newpath, async function (err) {
            if (err) throw err;
            sharp(newpath)
                .resize(200, 200)
                .toFormat('jpeg')
                .jpeg({
                    quality: 100,
                    chromaSubsampling: '4:4:4',
                    force: true
                })
                .toFile(newpath_1, function (err) {

                    fs.unlink(newpath, async (err) => {
                        if (err) {

                            console.log('Ошибка удаления изображения');
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