import { ManagerAppDepInstallRequired } from '@ledgerhq/errors';
import {
    createAccountAndSwapAtomic,
    createTokenSwap,
    swap,
    depositAllTokenTypes,
    withdrawAllTokenTypes,
    depositSingleTokenTypeExactAmountIn,
    withdrawSingleTokenTypeExactAmountOut,
} from '../utils/swapPool'
import { CurveType, Numberu64 } from '../utils/tokenSwap';


async function main() {
    console.log(
        'CreateTokenSwap (constant product)',
    );
    await createTokenSwap(CurveType.ConstantProduct);
}

// run through cli
main().catch(err => {
    console.error(err);
    process.exit(-1)
}).then(() => process.exit())