/**
 * Interface home.
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
const tools = require('./tools.js');

let control = 'home';

module.exports.display = function () {
  let ret = tools.getHeadline(control) + tools.getHeader() +
          tools.getActions(control) + tools.getBody();
  tools.cleanupBody();
  return ret;
};

module.exports.showHistory = function () {
  global.body.history = tools.getHistory();
};

module.exports.deleteHistory = function () {
  global.history = {};
};