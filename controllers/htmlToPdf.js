async function generateHtml(templateUrl,jsonData) {

    let htmlTemplate = templateUrl;
    // let htmlTemplate = fs.readFileSync(templateUrl, 'utf-8');

    const app = new Vue({
      template: htmlTemplate,
      data: {
        endpoint: "https://api.jsonbin.io/b/615541294a82881d6c5815ca/10",
        reportCardData: null,
        schoolModel: null,
        studentExamModel: null
      },
      methods: {
        sortedList(array,field) {
            return array.sort((a, b) => a[field] - b[field]);
        },
        getAllData() {
            axios
                .get(this.endpoint)
                .then((response) => {
                    this.reportCardData = response.data;
                    this.schoolModel = this.reportCardData.school_model;
                    this.studentExamModel = this.reportCardData.student_exam_models;
                    console.log(this.studentExamModel);
                })
                .catch((error) => {
                    console.log("-----error-------");
                    console.log(error);
                });
        },
      }
    });

    let htmlFilePath = path.resolve(`./reportCard-out/reportCard_${1}.html`);

    ///Volumes/Data/Code/bitqit/qb-invoice-generator

    return new Promise((resolve, reject) => {
      renderer.renderToString(app, (err, html) => {
        if (err)
          reject(err);

        fs.writeFileSync(htmlFilePath, html, 'utf-8');

        resolve(htmlFilePath);
      });
    })
  }

  async function createPdf(htmlFilePath, pdfFilePath) {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    page.viewport({
      height: 900,
      width: 1400
    });

    await page.goto(htmlFilePath, {waitUntil: 'load'});

    await page.screenshot();

    await page.pdf({
      path: pdfFilePath,
      format: 'A4',
      margin: {
        top: '0px',
        right: '0px',
        left: '0px',
        bottom: '0px',
      }
    });

    await browser.close();

    return path.resolve(pdfFilePath);
  }

  module.exports ={
      generateHtml
  };