import { BinaryRelation } from "./BinaryRelation";
import { InputJson } from "./InputJson";

const data: InputJson = require(`../${process.argv[2]}`);

const binaryRelation = new BinaryRelation(data.fields, data.columns, data.initial_data);
console.log('\nБлокировка');
console.log(binaryRelation.printLeaders(binaryRelation.blocking()));
console.log('Доминирование');
console.log(binaryRelation.printLeaders(binaryRelation.dominant()));
console.log('Блокировка и доминирование');
console.log(binaryRelation.printLeaders(binaryRelation.blockingAndDominantCompare()));
console.log('Турнир');
console.log(binaryRelation.printTournamentBoard(binaryRelation.tournament()));
console.log('Турнир * коэффициент');
console.log(binaryRelation.printTournamentBoard(binaryRelation.tournamentWithSign()));
console.log('Сортированный турнир * коэффициент');
console.log(binaryRelation.printTournamentBoard(binaryRelation.tournamentWithSignSort()));
console.log('Сумма очков за турнир');
console.log(binaryRelation.printTournametnScore(binaryRelation.tournamentScores()));