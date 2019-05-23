const puppeteer = require('puppeteer');
const Koa = require('koa');
const path = require('path')
const statics = require('koa-static')
const staticCache = require('koa-static-cache')
const app = new Koa();
const bodyParser = require('koa-bodyparser')
app.use(bodyParser());

const fs = require('fs')
async function screenshot(url) {
  console.log('开始请求', new Date().toTimeString())
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: 1024,
      height: 768
    }
  });
  let path = `public/image/${url.replace(/[^0-9a-zA-Z]/g, '')}.png`
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: path });
  } catch (ex) {

  }
  await browser.close();
  console.log('结束请求', new Date().toTimeString())
  return path
}

const staticPath = './public'
app.use(statics(
  path.join(__dirname, staticPath)
))
// app.use(staticCache(path.join(__dirname, staticPath), {
//   maxAge: 365 * 24 * 60 * 60
// }))

app.use(async ctx => {
  if (ctx.method.toLocaleLowerCase() == 'post') {
    let obj = ctx.request.body
    console.log(new Date().toLocaleString(), obj.url)
    let url = `/image/${obj.url.replace(/[^0-9a-zA-Z]/g, '')}.png`
    if (!fs.existsSync(`public${url}`)) {
      await screenshot(obj.url)
    }
    console.log(url)
    ctx.body = {
      url: url
    }
  } else {
    ctx.body = '你很棒棒的哦'
  }
});

app.listen(2225);
console.log(`http://localhost:2225`)