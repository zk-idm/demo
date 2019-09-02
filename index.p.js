/**
 * Simple node server to handle different entities.
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
global.config = require('./config/config.js');
if (typeof global.config.user === 'undefined') {
  console.log('Default user is set.');
  global.config.user = global.config.users.prover[0];
}
global.history = {};
global.body = {};

const http = require('http'),
      initServer = require('./inc/server.js');

http.createServer(initServer).listen(
        global.config.node.server.portProver, function (err)
{
  if (err) console.error('Unable to create node server.');
  else {
    console.log('Node server created. Port: %d',
            global.config.node.server.portProver);
  }
});