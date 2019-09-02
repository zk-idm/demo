/**
 * Controller for ING-Bank Bulletproofs.
 * license: MIT
 * author: Christoph Leixnering
 * adapted from: https://github.com/ing-bank/zkrp
 * version: 1.0
 * date: 2019-07-30
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package main
import (
  "fmt"
  "os"
  "strconv"
  "github.com/ing-bank/zkrp/bulletproofs"
  "math/big"
  "encoding/json"
  "io/ioutil")

func displayErr(s string) {
  fmt.Println(s)
  os.Exit(0)
}

func checkErr(e error, s string) {
  if e != nil {
    displayErr(s)
  }
}

func generateProof(params map[string]string) {
  x, err := strconv.ParseInt(params["-x"], 10, 64)
  checkErr(err, "Secret value invalid.")
  lower, err := strconv.ParseInt(params["-lower"], 10, 64)
  checkErr(err, "Lower range invalid.")
  upper, err := strconv.ParseInt(params["-upper"], 10, 64)
  checkErr(err, "Upper range invalid.")
  if lower >= upper {
    displayErr("Range distance invalid.")
  }
  if x < lower {
    displayErr("Secret out of lower range.")
  }
  if x >= upper {
    displayErr("Secret out of upper range.")
  }
  bprp, err := bulletproofs.SetupGeneric(lower, upper)
  checkErr(err, "Unable to setup proof.")
  proof, err := bulletproofs.ProveGeneric(new(big.Int).SetInt64(x), bprp)
  checkErr(err, "Unable to generate proof.")
  bytes, err := json.Marshal(proof)
  checkErr(err, "Unable to marshal json.")
  err = ioutil.WriteFile(params["-proofOut"], bytes, 0644)
  checkErr(err, "Unable to write proof file.")
  fmt.Printf("Proof generated and stored successfully.")
}

func verifyProof(params map[string]string) {
  bytes, err := ioutil.ReadFile(params["-proofIn"])
  checkErr(err, "Unable to read proof file.")
  var proof bulletproofs.ProofBPRP
  err = json.Unmarshal(bytes, &proof)
  checkErr(err, "Unable to unmarshal bytes.")
  res, err := proof.Verify()
  checkErr(err, "Unable to verify proof.")
  if res == true {
    fmt.Printf("Proof successfully verified.")
  } else {
    fmt.Printf("Proof verification failed.")
  }
}

func main() {
  params := map[string]string{}
  param := ""
  for _, arg := range os.Args[1:] {
    if 45 == arg[0] {
      param = arg
    } else {
      params[param] = arg
    }
  }
  if "generate" == params["-action"] {
    if 5 != len(params) {
      displayErr("Invalid argument number.")
    }
    generateProof(params);
  } else if "verify" == params["-action"] {
    if 2 != len(params) {
      displayErr("Invalid argument number.")
    }
    verifyProof(params);
  } else {
    displayErr("Invalid action parameter.")
  }
}