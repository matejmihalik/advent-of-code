import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2016/08', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(106);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(`
 ##  #### #    #### #     ##  #   #####  ##   ### 
#  # #    #    #    #    #  # #   ##    #  # #    
#    ###  #    ###  #    #  #  # # ###  #    #    
#    #    #    #    #    #  #   #  #    #     ##  
#  # #    #    #    #    #  #   #  #    #  #    # 
 ##  #    #### #### ####  ##    #  #     ##  ###  `);
    });
});
