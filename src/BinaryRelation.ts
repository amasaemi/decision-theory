// http://elib.spbstu.ru/dl/2/v17-1933.pdf/download/v17-1933.pdf

export interface TournamentRecord {
    field: string, 
    value: number
}

export class BinaryRelation {
    // массив входных полей (D)
    private arrayOfFields: Array<string> = [];
    // массив заголовков БО (BO), значимость БО и параметров, отвечающих за то, как сравнивать (1 - побеждает
    // большее БО, -1 - побеждаем меньшее БО)
    private arrayOfBinaryRelationHeaders: Array<{ name: string, sign: number, compare_param: number }> = [];
    // массив входных данных (D / BO)
    private arrayOfInitialData: Array<Array<number>> = [];
    // массив массивов бинарных отношений (где индекс первого массива - индекс массива БО)
    private arrayOfBinaryRelationValues: Array<Array<Array<boolean>>> = [];
    // Максимальная длина поля
    private maxFieldLength: number;
    // Максимальная длина названий БО
    private maxBRLength: number;

    public constructor(fields: Array<string>, binaryRelationHeaders: Array<{ name: string, sign: number, compare_param: number }>, initialData: Array<Array<number>>) {
        this.arrayOfFields = fields;
        this.arrayOfBinaryRelationHeaders = binaryRelationHeaders;
        this.arrayOfInitialData = initialData;

        // Находим максимальную длину полей для удобного вывода данных
        this.maxFieldLength = this.arrayOfFields[0].length;
        this.arrayOfFields.forEach(field => {
            if (field.length > this.maxFieldLength) this.maxFieldLength = field.length;
        });

        // Находимт максимальную длину названий БО для удобного вывода данных
        this.maxBRLength = this.arrayOfBinaryRelationHeaders[0].name.length;
        this.arrayOfBinaryRelationHeaders.forEach(header => {
            if (header.name.length > this.maxBRLength) this.maxBRLength = header.name.length;
        });

        // заполняем массив бинарных отношений
        this.arrayOfBinaryRelationValues = this.fillArrayOfBinaryRelationValues(this.arrayOfInitialData, this.arrayOfBinaryRelationHeaders, this.arrayOfFields.length);
        // печатаем на экран таблицы бинарных отношений
        this.printBinaryRelationValues(this.arrayOfFields, this.arrayOfBinaryRelationHeaders.map(item => item.name), this.arrayOfBinaryRelationValues);
    }

    /**
     * Метод заполняет массив бинарных отношений
     * @param initialData 
     * @param binaryRelationsHeaders
     * @param fieldsCount 
     */
    private fillArrayOfBinaryRelationValues(initialData: Array<Array<number>>, binaryRelationsHeaders: Array<{ name: string, sign: number, compare_param: number }>, fieldsCount: number): Array<Array<Array<boolean>>> {
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
                    const binaryRelationWeightResult: boolean = (binaryRelation.compare_param < 0) ? binaryRelationWeight < 0 : binaryRelationWeight > 0;
                    // производим сравнение параметров бинарного отношения
                    const currentBinaryRelation: boolean = (mainCompareValue != initialData[i][k]) 
                        ? (binaryRelation.compare_param < 0)
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
     * Метод выполняет турнирный механизм и возвращает количество очков каждого участника турнира по каждому бо
     */
    public tournament(): Array<Array<TournamentRecord>> {
        const tournamentBoard: Array<Array<TournamentRecord>> = [];
        // для каждого бинарного отношения
        this.arrayOfBinaryRelationValues.forEach((binaryRelationTable, i) => {
            tournamentBoard.push(Array.from({ length: binaryRelationTable.length }, (_k, v) => { return { field: this.arrayOfFields[v], value: 0 }} ));

            // для каждого элемента столбца
            binaryRelationTable.forEach((line, j) => {
                // прибавляем 2, если участник выигрывает у текущего соперника, 1 - если ничья, 0 - если проигрывает
                line.forEach((item, k) => tournamentBoard[i][j].value += 
                    (item > binaryRelationTable[j][k] || item == binaryRelationTable[j][k] && item > binaryRelationTable[k][j]) ? 2
                        : (item == binaryRelationTable[j][k] && item == binaryRelationTable[k][j]) ? 1 : 0)
            })
        });

        return tournamentBoard;
    }

    /**
     * Метод выполняет турнирный механизм и возвращает сумму элементов по каждому критерию * на коэффициент значимости
     */
    public tournamentWithSign(): Array<Array<TournamentRecord>> {
        return this.tournament()
            .map((line, brIndex) => line
                .map(item => { return { field: item.field, value: Math.ceil(item.value * this.arrayOfBinaryRelationHeaders[brIndex].sign * 100) / 100 } }))
    }

    /**
     * Метод выполняет сортировку для tournamentWithSign
     */
    public tournamentWithSignSort(): Array<Array<TournamentRecord>> {
        return this.tournamentWithSign()
            .map(line => line
                .sort((a, b) => b.value - a.value));
    }

    /**
     * Метод возвращает суммарное количество очков каждого участника турнира
     */
    public tournamentScores(): Array<TournamentRecord> {
        const tournamentBoard = this.tournamentWithSign();
        return tournamentBoard[0]
            .map((_line, i) => tournamentBoard.map(row => row[i]))
            .map(line => { return { field: line[0].field, value: line
                .reduce((acc, item) => acc + item.value, 0) } })
            .sort((a, b) => b.value - a.value)
    }

    /**
     * Метод печатает на экран таблицы бинарных отношений
     * @param fields 
     * @param binaryRelationHeaders 
     * @param binaryRelationValues
     */
    private printBinaryRelationValues(fields: Array<string>, binaryRelationHeaders: Array<string>, binaryRelationValues: Array<Array<Array<boolean>>>) {
        binaryRelationValues.forEach((binaryRelationTable, indexOfBinaryRelation) => {
            console.log(`\nТаблица бинарных отношений для параметра "${binaryRelationHeaders[indexOfBinaryRelation]}":`);

            let headerSeparator: string = ')    (';
            let fieldSeparator: string = '    ';
            let dataSeparator: string = '      ';
            let fieldsIndexes: number[] = [];
            fields.forEach((_, i) => fieldsIndexes.push(i));

            console.log(`${''.padEnd(this.maxFieldLength + 3, ' ')}${fieldSeparator}(${fieldsIndexes.join(headerSeparator)})`);

            fields.forEach((fieldName, indexOfField) => {
                console.log('(' + (indexOfField) + ') ' + fieldName.padEnd(this.maxFieldLength, ' ') + fieldSeparator + binaryRelationTable[indexOfField].map(item => item ? 1 : 0).join(dataSeparator));
            })
        })
    }

    //TODO Добавить возможность находить и выводить нескольких лидеров
    /**
     * Метод создаёт и возращает строку с победителями по каждому БО
     * @param leaders
     */
    public printLeaders(leaders: number[]): string {
        let output: string = '';

        this.arrayOfBinaryRelationHeaders.forEach((header, i) => {
            if (leaders[i] != -1)
                output += '  ' + header.name.padEnd(this.maxBRLength, ' ') + ' : (' + leaders[i] + ') ' + this.arrayOfFields[leaders[i]] + '\n';
            else
                output += '  ' + header.name.padEnd(this.maxBRLength, ' ') + ' :  -\n';
        });

        return output;
    }

    /**
     * Метод создаёт и возращает строку с данными турнира
     * @param tournamentBoard
     */
    public printTournamentBoard(tournamentBoard: Array<Array<TournamentRecord>>): string {
        let output: string = '';

        tournamentBoard.forEach((binaryRelation, i) => {
            output += this.arrayOfBinaryRelationHeaders[i].name + '\n';

            binaryRelation.forEach((result) => {
                output += '  (' + this.arrayOfFields.indexOf(result.field) + ') ' + result.field.padEnd(this.maxFieldLength, ' ') + ' - ' + result.value + '\n';
            })
        });

        return output;
    }

    /**
     * Метод создаёт и возращает строку с суммой очков турнира
     * @param tournamentScore
     */
    public printTournametnScore(tournamentScore: Array<TournamentRecord>) {
        let output: string = '';

        tournamentScore.forEach((result) => {
            output += '(' + this.arrayOfFields.indexOf(result.field) + ') ' + result.field.padEnd(this.maxFieldLength, ' ') + ' - ' + result.value + '\n';
        });

        return output;
    }
}