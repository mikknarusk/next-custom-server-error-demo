const express = require('express')
const expressApp = express()
const path = require('path')
const port = 3000

const next = require('next')
const nextApp = next({ dev: true, customServer: true, hostname: 'localhost', port })
const handle = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const staticFolder = path.resolve(process.cwd(), '.next/static');
  expressApp.use(
    '/_next/static',
    express.static(staticFolder, { maxAge: '365d', immutable: true }),
  );
  expressApp.use(
    '/public/_next/static',
    express.static(staticFolder, { maxAge: '365d', immutable: true }),
  );
  
  expressApp.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

  expressApp.get('/error', async (req, res) => {
    console.log('I will get called');
    const error = {
      name: 'foo',
      message: 'bar'
    }
    const html = await nextApp.renderErrorToHTML(error, req, res, req.path);
    console.log('I will never get called');
    res.send(html);
  })

  expressApp.get('*', async (req, res) => {
    void handle(req, res);
  })
})

