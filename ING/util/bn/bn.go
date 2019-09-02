/*
 * Copyright (C) 2019 ING BANK N.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package bn

import (
    "crypto/sha256"
    "math/big"

    "github.com/ing-bank/zkrp/util/byteconversion"
)

func CalculateHash(b1 *big.Int, b2 *big.Int) (*big.Int, error) {

    digest := sha256.New()
    digest.Write(byteconversion.ToByteArray(b1))
    if b2 != nil {
        digest.Write(byteconversion.ToByteArray(b2))
    }
    output := digest.Sum(nil)
    tmp := output[0:]
    return byteconversion.FromByteArray(tmp)
}

/**
 * Returns base**exponent mod |modulo| also works for negative exponent (contrary to big.Int.Exp)
 */
func ModPow(base *big.Int, exponent *big.Int, modulo *big.Int) *big.Int {

    var returnValue *big.Int

    if exponent.Cmp(big.NewInt(0)) >= 0 {
        returnValue = new(big.Int).Exp(base, exponent, modulo)
    } else {
        // Exp doesn't support negative exponent so instead:
        // use positive exponent than take inverse (modulo)..
        returnValue = ModInverse(new(big.Int).Exp(base, new(big.Int).Abs(exponent), modulo), modulo)
    }
    return returnValue
}

func Add(x *big.Int, y *big.Int) *big.Int {
    return new(big.Int).Add(x, y)
}

func Sub(x *big.Int, y *big.Int) *big.Int {
    return new(big.Int).Sub(x, y)
}

func Mod(base *big.Int, modulo *big.Int) *big.Int {
    return new(big.Int).Mod(base, modulo)
}

func Multiply(factor1 *big.Int, factor2 *big.Int) *big.Int {
    return new(big.Int).Mul(factor1, factor2)
}

func ModInverse(base *big.Int, modulo *big.Int) *big.Int {
    return new(big.Int).ModInverse(base, modulo)
}
