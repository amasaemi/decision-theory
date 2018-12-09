import { BinaryRelation } from "./BinaryRelation";
import { InputJson } from "./InputJson";

// const readline = require('readline-sync');

const data: InputJson = require('../input.origin.json')

const binaryRelation = new BinaryRelation(data.fields, data.columns, data.initial_data);
console.log('\nБлокировка')
console.log(binaryRelation.blocking())
console.log('\nДоминирование')
console.log(binaryRelation.dominant())
console.log('\nБлокировка и доминирование')
console.log(binaryRelation.blockingAndDominantCompare())
console.log('\nТурнир')
console.log(binaryRelation.tournament())
console.log('\nТурнир * коэффициент')
console.log(binaryRelation.tournamentWithSign())
console.log('\nСортированный турнир * коэффициент')
console.log(binaryRelation.tournamentWithSignSort())
console.log('\nСумма очков за турнир')
console.log(binaryRelation.tournamentScores())