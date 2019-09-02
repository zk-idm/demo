/**
 * Helper tools.
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
const { execSync } = require('child_process'),
      fs = require('fs'),
      performance = require('perf_hooks').performance,
      users = [...global.config.users.prover,
        ...global.config.users.verifier,
        ...global.config.users.issuer];

module.exports.checkEnvVar = function (variable) {
  try {
    let res = execSync('echo ' + variable);
    if (res.toString().trim() === variable) {
      console.log('Environment variable %s not set.', variable);
      return false;
    }
    return true;
  } catch (err) {
    console.error(err.message);
  }
};

function getSourceFile(path) {
  try {
    return execSync('type ' + path);
  } catch (err) {
    console.error(err.message);
  }
};
module.exports.getSourceFile = getSourceFile;

function getIpfsFile(id) {
  try {
    return execSync("wget -q -O - " + global.config.sproof.ipfs + id);
  } catch (err) {
    console.error(err.message);
  }
};
module.exports.getIpfsFile = getIpfsFile;

module.exports.getIpfsJson = function (id) {
  let ret = getIpfsFile(id);
  try {
    return JSON.parse(ret);
  } catch (err) {
    console.error(err.message);
  }
};

function writeToFile(data, path) {
  try {
    fs.writeFileSync(path, data);
  } catch (err) {
    console.error(err.message);
  }
};
module.exports.writeToFile = writeToFile;

module.exports.appendToFile = function (data, path) {
  try {
    fs.appendFileSync(path, data);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.getWitness = function (path) {
  try {
    let res = execSync("grep '~out' " + path).toString();
    let cnt = (res.match(/~out_/g) || []).length;
    let out = [];
    for (let i = 0; i < cnt; i++) {
      let exp = '~out_' + i + ' ([0-9]+)';
      out.push(new RegExp(exp).exec(res)[1]);
    }
    return out;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.extendZoKratesFnc = function (inPath, hD, outPath) {
  try {
    zToExtend = getSourceFile(inPath);
    let zExtended = zToExtend.toString().replace(
            /REPLACE_WITH_DOCUMENT_HASH_PART_0/gi, hD[0]);
    zExtended = zExtended.replace(
            /REPLACE_WITH_DOCUMENT_HASH_PART_1/gi, hD[1]);
    writeToFile(Buffer.from(zExtended), outPath);
  } catch (err) {
    console.error(err.message);
  }
};

function deleteFile(path) {
  try {
    execSync("rm " + path);
  } catch (err) {
    console.error(err.message);
  }
};
module.exports.deleteFile = deleteFile;

function copyFile(inPath, outPath) {
  try {
    execSync("type " + inPath + " > " + outPath);
  } catch (err) {
    console.error(err.message);
  }
};
module.exports.deleteFile = deleteFile;

function getTmpFilePath(ending) {
  let path = global.config.node.tmp.path + '\\' +
          parseInt(Math.random()*Math.pow(10, 9));
  if (ending) {
    path += ending;
  }
  return path;
};
module.exports.getTmpFilePath = getTmpFilePath;

function fileExists(path) {
  try {
    if (fs.existsSync(path)) {
      return true;
    }
    return false;
  } catch (err) { console.error(err.message); }
};
module.exports.fileExists = fileExists;

module.exports.splitFile = function (path) {
  let stat = fs.statSync(path);
  let cntParts = Math.ceil(stat.size/(1024*1024*6));
  if (cntParts < 9) {
    try {
      execSync("split -b 6M -d --suffix-length=1 " + path + " " + path);
      let parts = [];
      for (let i = 0; i < cntParts+1; i++) {
        if (fileExists(path + i)) {
          parts.push(path + i);
        }
      }
      return parts;
    } catch (err) { console.error(err.message); }
  } else { console.error('File size exceed limit.'); }
};

module.exports.copyAndGzipFile = function (inPath) {
  let path = getTmpFilePath();
  copyFile(inPath, path);
  try {
    execSync("gzip " + path);
    return path + '.gz';
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.copyAndUngzipFile = function (inPath, outPath) {
  copyFile(inPath, outPath + '.gz');
  try {
    execSync("gzip -d -f " + outPath + '.gz');
    return outPath;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.gzipData = function (data) {
  let path = getTmpFilePath();
  try {
    writeToFile(data, path);
    execSync("gzip " + path);
    data = getSourceFile(path + '.gz');
    deleteFile(path + '.gz');
    return data;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.ungzipData = function (data) {
  let path = getTmpFilePath();
  try {
    writeToFile(data, path + '.gz');
    execSync("gzip -d " + path + '.gz');
    data = getSourceFile(path);
    deleteFile(path);
    return data;
  } catch (err) {
    console.error(err.message);
  }
};

function isEmpty(obj) {
  if (undefined !== obj && '{}' !== obj) {
    return JSON.stringify(obj) === JSON.stringify({});
  }
  return true;
};
module.exports.isEmpty = isEmpty;

function getDeepProperty(search, data) {
  let props = search.split('.');
  let ret = false;
  if (props.length > 0) { ret = data; }
  props.forEach(function (prop) {
    if (!isEmpty(ret)) {
      if(ret.hasOwnProperty(prop)) { ret = ret[prop]; }
      else { ret = false; }
    } else  { ret = false; }
  });
  return ret;
}
module.exports.getDeepProperty = getDeepProperty;

module.exports.prepareInput = function (input, data) {
  ret = {};
  for (let paramName in input) {
    if (input[paramName] !== null) {
      ret[paramName] = input[paramName];
      if (input[paramName] === 'undefined'
              || input[paramName] === undefined) {
        ret[paramName] = undefined;
      } else if (input[paramName].toString().match(
              /[a-z0-9]+(\.[a-z0-9])+/i)) {
        prop = getDeepProperty(input[paramName], data);
        if (prop !== false) { ret[paramName] = prop; }
      }
    }
  }
  return ret;
};

module.exports.startTiming = function (action) {
  let timeNow = performance.now();
  global.timer.total = timeNow;
  global.timer.execution = timeNow;
  if (global.config.node.timing.display === true) {
    console.log('Start timer for action: ' + action);
    console.log('Time now: ' + timeNow);
  }
};

module.exports.displayTiming = function (action) {
  let timeNow = performance.now();
  if (global.config.node.timing.display === true) {
    console.log('Time now: ' + timeNow);
    console.log('Time elapsed since start: ' +
            (timeNow - global.timer.total));
    console.log(action + ' execution time: ' +
            (timeNow - global.timer.execution));
  }
  global.timer.execution = timeNow;
};

module.exports.getHeadline = function (control) {
  let ret = '';
  switch (control) {
    case 'idm':
      ret += 'SPROOF IDM';
      break;
    case 'snark':
      ret += 'ZoKrates ZK-SNARK';
      break;
    case 'zkrp':
      ret += 'ING ZKRP';
      break;
    case 'home':
    default:
      ret += 'Blockchain and Trusted Decentralized Identity:\
          Zero-Knowledge Proof of Identity for\
          Attribute-Based Self-Sovereign Identity Management';
      break;
  }
  return ret += '<br><br>';
};

module.exports.getInfo = function () {
  return 'Pressing control key while clicking on action link \
      adds changeable default input parameter and \
      hovering displays action information.<br>';
};

module.exports.getActions = function (control) {
  let ret = '';
  for (let fncName in global.config[control].fnc) {
    if (-1 !== global.config[control].fnc[fncName].roles.indexOf(
            global.config.user.role))
    {
      if (ret !== '') { ret += ' | '; }
      ret += this.getLink(global.config[control].fnc[fncName]);
    }
  }
  return ret += '<br><br>';
};

module.exports.getLink = function (params) {
  let ret = '<a href="' + params.href + '"';
  ret += ' data-input="' + escape(JSON.stringify(
          params.input, null, 2)) + '"';
  ret += ' onClick="return doInput(this, event);"';
  if (params.title) ret += ' title="' + params.title + '"';
  ret += '>' + params.text;
  ret += '</a>';
  return ret;
};

module.exports.getUserSelection = function () {
  let ret = '<select onchange="document.location.href=document.\
        location.href.replace(/\\?(.*)/gi,\'\\?&user=\')+this.value;">';
  users.forEach(function (user) {
    if (user.role === global.config.user.role) {
      ret += '<option ' + 
              (user.id === global.config.user.id ? 'selected ' : '') +
              'value="' + user.id + '">' + user.name + '</option>';
    }
  });
  ret += '</select>';
  return ret;
};

module.exports.setUser = function (id) {
  users.forEach(function (user) {
    if (id === user.id) {
      global.config.user = user;
    }
  });
};

module.exports.getScript = function () {
  let ret = '<script>function doInput(t, e) {\
      input = document.getElementById(\'input-params\');\
      if (e.ctrlKey) {\
        input.innerHTML = unescape(t.dataset.input);\
        return false;\
      } else {\
        if (escape(input.innerHTML))\
            t.href = t.href + \'&input=\' + escape(input.innerHTML);\
        return true;\
      }\
    }</script>';
  return ret;
};

module.exports.getHeader = function (control) {
  let ret = this.getScript();
  ret += '<a href="/?">Home</a> | ';
  ret += this.getUserSelection();
  if (control) {
    ret += ' | <a href="/' + control + '?fnc=showHistory">Show ' +
            control.toUpperCase() + ' History</a>';
  }
  else ret += ' | <a href="/?fnc=showHistory">Show Full History</a>';
  if (control) {
    ret += ' | <a href="/' + control + '?fnc=deleteHistory">Delete ' +
            control.toUpperCase() + ' History</a>';
  }
  else ret += ' | <a href="/?fnc=deleteHistory">Delete Full History</a>';
  ret += '<br><br>';
  return ret;
};

module.exports.getBody = function () {
    let ret = '<div>INPUT PARAMS:<br><pre id="input-params" \
            contenteditable="true" style="min-height: 45px; \
            border: 1px solid #ccc;"></pre></div><br>';
    if (global.body.history) {
      ret += '<div>HISTORY:<br><pre>' + 
              JSON.stringify(global.body.history, null, 2) +
              '</pre></div><br>';
    }
    return ret;
};

module.exports.cleanupBody = function () {
  global.body = {};
};

module.exports.getHistory = function (control) {
  if (control) {
    if (typeof global.history[control] === 'undefined') {
      global.history[control] = {};
    }
    return global.history[control];
  }
  else return global.history;
};

module.exports.addHistory = function (control, res, addon) {
  res.addon = addon;
  if (Array.isArray(global.history[control])) {
    global.history[control].unshift(res);
  } else {
    global.history[control] = [];
    global.history[control].push(res);
  }
};