import { BinaryRelation } from "./BinaryRelation";

const readline = require('readline-sync');

// массив входных полей (D) и параметр, отвечающий за то, как сравнивать (1 - побеждает
// большее БО, -1 - побеждаем меньшее БО)
const arrayOfFields: Array<string> = [];
// массив заголовков БО (BO)
const arrayOfBo: Array<{ brName: string, compareParam: number }> = [];
// массив входных данных (D / BO)
const arrayOfInputData: Array<Array<number>> = [];
// массив массивов бинарных отношений (где индекс первого массива - индекс массива БО)
// const arrayOfBinatyRelationValue: Array<Array<Array<boolean>>> = [];

/**
 * Функция инициализирует массив полей
 */
function fillArrayOfFields() {
	console.log('First, add fields for continue decision');
	
	const arrayOfFieldsCount = Number(readline.question('\nInput fields (D) count: ', { limit: /^\d+$/ }));
	
	if (arrayOfFieldsCount > 0) {
		// заполняем массив входных полей значениями
		for (let i = 0; i < arrayOfFieldsCount; i++)
			arrayOfFields.push(readline.question(`Input '${i + 1}' field (D) name: `));
		
		console.log(`\nWe added ${arrayOfFieldsCount} fields:`);
		console.log(arrayOfFields)
	} else {
		console.log('\nError filling array of fields');
	}
}

/**
 * Функция инициализирует массив полей бинарных отношений BO
 */
function fillArrayOfBo() {
	console.log('\nSecond, add BO titles');
	
	const arrayOfBoCount = Number(readline.question('\nInput BO fields (BO) count: ', { limit: /^\d+$/ }));
	
	if (arrayOfBoCount > 0) {
		// заполняем массив входных полей значениями
		for (let i = 0; i < arrayOfBoCount; i++)
			arrayOfBo.push(readline.question(`Input '${i + 1}' field (BO) name: `));
		
		console.log(`\nWe added ${arrayOfBoCount} BO fields:`);
		console.log(arrayOfBo)
	} else {
		console.log('\nError filling array of fields');
	}
}

/**
 * Функция заполняет массив входных значений
 */
function fillInputDataArray() {
	console.log('\nThree, add initial data\n');
	
	arrayOfBo.forEach((bo, boIndex) => {
		console.log(`Ok, next input values for BO '${bo}'`);
		
		arrayOfFields.forEach((field, _fieldIndex) => {
			arrayOfInputData.push([]);
			arrayOfInputData[boIndex].push(readline.question(`Value for field '${field}': `))
		})
	});
}

// fillArrayOfFields();
// fillArrayOfBo();
// fillInputDataArray();

arrayOfFields.push('Lada Vesta');
arrayOfFields.push('Land Cruiser');
// arrayOfFields.push('Mazeratti12');
arrayOfFields.push('Mazeratti');

arrayOfBo.push({ brName: 'Price', compareParam: -1 })
arrayOfBo.push({ brName: 'Rashod', compareParam: -1 })
arrayOfBo.push({ brName: 'Eshe parameter', compareParam: 1 })

arrayOfInputData.push([ 50000, 700000, 1000000, 1000000 ])
arrayOfInputData.push([ 8, 14, 6, 6 ])
arrayOfInputData.push([ 1, 8, 2, 2 ])

new BinaryRelation(arrayOfFields, arrayOfBo, arrayOfInputData);