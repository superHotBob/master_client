import fs from "fs";
import { Formidable } from 'formidable';


export async function POST(req, res) {
    const form = new Formidable();
    form.parse(req, function (err, fields, files) {
       
        const oldpath = files.file[0].filepath
       
        const newpath = '../../data/images/' + files.file[0].originalFilename;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
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