import { BinaryRelation } from "./BinaryRelation";

// const readline = require('readline-sync');

// массив входных полей (D) и параметр, отвечающий за то, как сравнивать (1 - побеждает
// большее БО, -1 - побеждаем меньшее БО)
const arrayOfFields: Array<string> = [];
// массив заголовков БО (BO)
const arrayOfBo: Array<{ brName: string, sign: number, compareParam: number }> = [];
// массив входных данных (D / BO)
const arrayOfInputData: Array<Array<number>> = [];

// fillArrayOfFields();
// fillArrayOfBo();
// fillInputDataArray();

arrayOfFields.push('Lada Vesta');
arrayOfFields.push('Land Cruiser');
// arrayOfFields.push('Mazeratti12');
arrayOfFields.push('Mazeratti');

arrayOfBo.push({ brName: 'Price', sign: 0.5, compareParam: -1 })
arrayOfBo.push({ brName: 'Rashod', sign: 0.4, compareParam: -1 })
arrayOfBo.push({ brName: 'Eshe parameter', sign: 0.1, compareParam: 1 })

arrayOfInputData.push([ 50000, 700000, 1000000, 1000000 ])
arrayOfInputData.push([ 8, 14, 6, 6 ])
arrayOfInputData.push([ 1, 8, 2, 2 ])

const binaryRelation = new BinaryRelation(arrayOfFields, arrayOfBo, arrayOfInputData);
console.log(binaryRelation.blocking())
console.log(binaryRelation.dominant())
console.log(binaryRelation.blockingAndDominantCompare())
console.log(binaryRelation.tournament())
console.log(binaryRelation.tournamentWithSign())