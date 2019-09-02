/**
 * Secret config file for node interface and controls.
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
let secretConfig = {
  users: {
    prover: [ {
        credentials: {
          address: '', // Add SPROOF Ethereum address of role prover.
          publicKey: '', // Add SPROOF public key of role prover.
          privateKey: '', // Add SPROOF private key of role prover.
          sproofCode: '' // Add SPROOF code of role prover.
        }
      }, {
        credentials: {
          address: '', // Add SPROOF Ethereum address of role prover.
          publicKey: '', // Add SPROOF public key of role prover.
          privateKey: '', // Add SPROOF private key of role prover.
          sproofCode: '' // Add SPROOF code of role prover.
        }
      }
    ],
    verifier: [ {
        credentials: {
          address: '', // Add SPROOF Ethereum address of role verifier.
          publicKey: '', // Add SPROOF public key of role verifier.
          privateKey: '', // Add SPROOF private key of role verifier.
          sproofCode: '' // Add SPROOF code of role verifier.
        }
      }, {
        credentials: {
          address: '', // Add SPROOF Ethereum address of role verifier.
          publicKey: '', // Add SPROOF public key of role verifier.
          privateKey: '', // Add SPROOF private key of role verifier.
          sproofCode: '' // Add SPROOF code of role verifier.
        }
      }
    ],
    issuer: [ {
        credentials: {
          address: '', // Add SPROOF Ethereum address of role issuer.
          publicKey: '', // Add SPROOF public key of role issuer.
          privateKey: '', // Add SPROOF private key of role issuer.
          sproofCode: '' // Add SPROOF code of role issuer.
        }
      }, {
        credentials: {
          address: '', // Add SPROOF Ethereum address of role issuer.
          publicKey: '', // Add SPROOF public key of role issuer.
          privateKey: '', // Add SPROOF private key of role issuer.
          sproofCode: '' // Add SPROOF code of role issuer.
        }
      }
    ]
  },
  infura: {
    projectId: '' // Add infura node service project id for interaction with Ethereum network.
  }
};
module.exports = secretConfig;