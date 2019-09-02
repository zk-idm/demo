/**
 * ING ZKRP control.
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
const { execFileSync } = require('child_process'),
      toolsEth = require('./tools.eth.js'),
      tools = require('./tools.js');

let control = 'zkrp';

module.exports.display = function () {
  let ret = tools.getHeadline(control) + tools.getHeader(control) +
          tools.getInfo() + tools.getActions(control) + tools.getBody();
  tools.cleanupBody();
  return ret;
};

module.exports.getBalance = function (user) {
  toolsEth.getBalance(user, control);
};

module.exports.getTransactionCount = function (user) {
  toolsEth.getTransactionCount(user, control);
};

module.exports.generateProof = function (user, input, ret) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let cmd = ['-action', 'generate', '-x', input.x, '-lower', input.lower,
    '-upper', input.upper, '-proofOut', input.outPath];
  try {
    let res = execFileSync(global.config.ing.executablePath, cmd,
      { maxBuffer: global.config.node.exec.maxBuffer });
    res = { proof: input.outPath };
    if (ret) { return res; }
    else {
      tools.addHistory(control, res, {fnc: 'generateProof'});
      console.log(res);
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.verifyProof = function (user, input, ret) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let cmd = ['-action', 'verify', '-proofIn', input.inPath];
  try {
    let res = execFileSync(global.config.ing.executablePath, cmd,
      { maxBuffer: global.config.node.exec.maxBuffer }).toString();
    if (ret) { return res; }
    else {
      tools.addHistory(control, res, {fnc: 'verifyProof'});
      console.log(res);
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.showHistory = function () {
    global.body.history = tools.getHistory(control);
};

module.exports.deleteHistory = function () {
    global.history[control] = {};
};