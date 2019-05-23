const puppeteer = require('puppeteer');
const Koa = require('koa');
const path = require('path')
const statics = require('koa-static')
const app = new Koa();
const bodyParser = require('koa-bodyparser')
app.use(bodyParser());

const fs = require('fs')
async function screenshot(url) {
  console.log(new Date().toTimeString())
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: 1024,
      height: 768
    }
  });
  const page = await browser.newPage();
  let path = `public/image/${url.replace(/[^0-9a-zA-Z]/g, '')}.png`
  await page.goto(url);
  await page.screenshot({ path: path });
  await browser.close();
  console.log(new Date().toTimeString())
  return path
}

const staticPath = './public'
app.use(statics(
  path.join(__dirname, staticPath)
))

app.use(async ctx => {
  if (ctx.method.toLocaleLowerCase() == 'post') {
    let obj = ctx.request.body
    console.log(new Date().toLocaleString(), obj.url)
    let url = `/image/${obj.url.replace(/[^0-9a-zA-Z]/g, '')}.png`
    if (!fs.existsSync(`public${url}`)) {
      await screenshot(obj.url)
    }
    ctx.body = {
      url: url
    }
  } else {
    ctx.body = '你很棒棒的哦'
  }
});

app.listen(2225);
console.log(`http://localhost:2225`)