// http://elib.spbstu.ru/dl/2/v17-1933.pdf/download/v17-1933.pdf

export class BinaryRelation {
    // массив входных полей (D)
    private arrayOfFields: Array<string> = [];
    // массив заголовков БО (BO) и параметров, отвечающих за то, как сравнивать (1 - побеждает
    // большее БО, -1 - побеждаем меньшее БО)
    private arrayOfBinaryRelationHeaders: Array<{ brName: string, compareParam: number }> = [];
    // массив входных данных (D / BO)
    private arrayOfInitialData: Array<Array<number>> = [];
    // массив массивов бинарных отношений (где индекс первого массива - индекс массива БО)
    private arrayOfBinaryRelationValues: Array<Array<Array<boolean>>> = [];

    public constructor(fields: Array<string>, binaryRelationHeaders: Array<{ brName: string, compareParam: number }>, initialData: Array<Array<number>>) {
        this.arrayOfFields = fields;
        this.arrayOfBinaryRelationHeaders = binaryRelationHeaders;
        this.arrayOfInitialData = initialData;
        
        // заполняем массив бинарных отношений
        this.arrayOfBinaryRelationValues = this.fillArrayOfBinaryRelationValues(this.arrayOfInitialData, this.arrayOfBinaryRelationHeaders, this.arrayOfFields.length);
        // печатаем на экран таблицы бинарных отношений
        this.printBinaryRelationValues(this.arrayOfFields, this.arrayOfBinaryRelationHeaders, this.arrayOfBinaryRelationValues);
    }

    /**
     * Метод заполняет массив бинарных отношений
     * @param initialData 
     * @param binaryRelationsHeaders
     * @param fieldsCount 
     */
    private fillArrayOfBinaryRelationValues(initialData: Array<Array<number>>, binaryRelationsHeaders: Array<{ brName: string, compareParam: number }>, fieldsCount: number): Array<Array<Array<boolean>>> {
        const localArrayOfBinaryRelationValues: Array<Array<Array<boolean>>> = [];

        binaryRelationsHeaders.forEach((binaryRelation, i) => {
            localArrayOfBinaryRelationValues.push([]);

            for (let j = 0; j < fieldsCount; j++) {
                localArrayOfBinaryRelationValues[i].push([]);
                // значение, с которым производим сравнение по столбцам
                const mainCompareValue = initialData[i][j];
 
                for (let k = 0; k < fieldsCount; k++) {
                    // проверка на то, что если (mainCompareValue - MAX + mainCompareValue - MIN) < 0 тогда при равности 2х БО обоим ставить false инчае обоим true
                    const binaryRelationWeight: number = (mainCompareValue - Math.max.apply(null, initialData[i])) + (mainCompareValue - Math.min.apply(null, initialData[i]));
                    const binaryRelationWeightResult: boolean = (binaryRelation.compareParam < 0) ? binaryRelationWeight < 0 : binaryRelationWeight > 0;
                    // производим сравнение параметров бинарного отношения
                    const currentBinaryRelation: boolean = (mainCompareValue != initialData[i][k]) 
                        ? (binaryRelation.compareParam < 0)
                            ? (mainCompareValue < initialData[i][k]) 
                            : (mainCompareValue > initialData[i][k])
                        :  binaryRelationWeightResult;
                    // добавляем значение бинарного отношения в массив бинарных отношений
                    localArrayOfBinaryRelationValues[i][j].push(currentBinaryRelation);
                }
            }
        });

        return localArrayOfBinaryRelationValues;
    }
    
    /**
     * Метод выполняет механизм блокировки и возвращает массив индексов победителей по каждому БО
     */
    public blocking(): Array<number> {
        const leaders: Array<number> = [];

        this.arrayOfBinaryRelationValues.forEach(binaryRelationTable => {
            // получаем массив сумм по столбцам
            const sumOfColumn: Array<number> = binaryRelationTable[0]
                .map((_c, i) => binaryRelationTable
                    .map(row => row[i])
                    .reduce((acc, next) => acc + (next ? 1 : 0), 0));
            // добавляем в массив индекс минимального элемента среди сумм столбцов
            leaders.push(sumOfColumn.indexOf(Math.min.apply(null, sumOfColumn)))
        });

        return leaders;
    }

    /**
     * Метод выполняет механизм доминирования и возвращает массив индексов победителей по каждому БО
     */
    public dominant(): Array<number> {
        const leaders: Array<number> = [];

        this.arrayOfBinaryRelationValues.forEach(binaryRelationTable => {
            // получаем массив сумм по строкам
            const sumOfLine: Array<number> = binaryRelationTable
                .map(line => line
                    .reduce((acc, next) => acc + (next ? 1 : 0), 0));
            // добавляем в массив индекс максимального элемента среди сумм строк
            leaders.push(sumOfLine.indexOf(Math.max.apply(null, sumOfLine)));
        });

        return leaders;
    }

    /**
     * Метод выполняет турнирный механизм и возвращает количество очков каждого участника турнира
     */
    public tournament(): Array<number> {
        const tournamentBoard: Array<number> = Array.from({ length: this.arrayOfFields.length }, () => 0);
        // для каждого бинарного отношения
        this.arrayOfBinaryRelationValues.forEach(binaryRelationTable => {
            // для каждого элемента столбца
            binaryRelationTable.forEach((line, i) => {
                for (let j = 0; j < line.length; j++) {
                    for (let k = 0; k < line.length; k++) {
                        // прибавляем 2, если участник выигрывает у текущего соперника, 1 - если ничья, 0 - если проигрывает
                        tournamentBoard[i] += (line[0] > binaryRelationTable[j][k]) ? 2 : (line[0] == binaryRelationTable[j][k]) ? 1 : 0
                    }
                }
            })
        });

        return tournamentBoard;
    }

    /**
     * Метод выполняет сравнение механизмов доминирования и блокировки, и возвращает массив индексов совпадений по каждому БО
     */
    public blockingAndDominantCompare(): Array<number> {
        const blck: Array<number> = this.blocking();
        const dmnt: Array<number> = this.dominant();
        const leaders: Array<number> = [];

        // если blck[i] и dmnt[i] не равны, на это место присваивается -1
        for (let i = 0; i < blck.length; i++)
            leaders.push(blck[i] == dmnt[i] ? blck[i] : -1);

        return leaders;
    }

    /**
     * Метод печатает на экран таблицы бинарных отношений
     * @param fields 
     * @param binaryRelationHeaders 
     * @param binaryRelationValues
     */
    private printBinaryRelationValues(fields: Array<string>, binaryRelationHeaders: Array<{ brName: string, compareParam: number }>, binaryRelationValues: Array<Array<Array<boolean>>>) {
        binaryRelationValues.forEach((binaryRelationTable, indexOfBinaryRelation) => {
            console.log(`\nТаблица бинарных отношений для параметра ${binaryRelationHeaders[indexOfBinaryRelation].brName}:`);

            console.log(`\t\t\t${fields.join('\t\t')}`);

            fields.forEach((fieldName, indexOfField) => {
                console.log(fieldName + '\t\t' + binaryRelationTable[indexOfField].join('\t\t\t'));
            })
        })
    }
}