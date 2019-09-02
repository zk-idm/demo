/**
 * Simple node server request handling.
 * license: MIT
 * author: Christoph Leixnering
 * version: 1.0
 * date: 2019-07-01
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
global.timer = {};

const url = require('url'),
      querystring = require('querystring'),
      tools = require('./tools.js');

let initServer = function (req, res) {
  let path = url.parse(req.url).pathname,
      params = querystring.parse(url.parse(req.url).query);
  if (params.user) {
    tools.setUser(params.user);
  }
  switch (path.toLowerCase()) {
    case '/idm':
      let idm = require('./sproof.js');
      if (params.fnc) {
        if (typeof idm[params.fnc] !== 'undefined') {
          console.log('Function %s called.', params.fnc);
          idm[params.fnc](global.config.user, params.input);
        } else {
          console.error('Requested function %s not exists.', params.fnc);
        }
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(idm.display());
      break;
    case '/snark':
      let snark = require('./zokrates.js');
      if (params.fnc) {
        if (typeof snark[params.fnc] !== 'undefined') {
          console.log('Function %s called.', params.fnc);
          snark[params.fnc](global.config.user, params.input);
        } else {
          console.error('Requested function %s not exists.', params.fnc);
        }
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(snark.display());
      break;
    case '/zkrp':
      let zkrp = require('./ing.js');
      if (params.fnc) {
        if (typeof zkrp[params.fnc] !== 'undefined') {
          console.log('Function %s called.', params.fnc);
          zkrp[params.fnc](global.config.user, params.input);
        } else {
          console.error('Requested function %s not exists.', params.fnc);
        }
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(zkrp.display());
      break;
    case '/':
    default:
      let home = require('./home.js');
      if (params.fnc) {
        if (typeof home[params.fnc] !== 'undefined') {
          console.log('Function %s called.', params.fnc);
          home[params.fnc](global.config.user, params.input);
        } else {
          console.error('Requested function %s not exists.', params.fnc);
        }
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(home.display());
      break;
  }
  res.end();
};
module.exports = initServer;