import { format, parse } from 'date-fns';

export function converterFormatoDataDiaMesAno(data: string): string {
    try {
        const dataFormatada = parse(data, 'dd/MM/yyyy', new Date());
        const dataFinal = format(dataFormatada, 'yyyy-MM-dd');

        return dataFinal;
    } catch (error: any) {
        throw new Error('Erro ao converter a data');
    }
}

export function converterFormatoDataAnoMesDia(data: string): string {
    try {
        const dataFormatada = parse(data, 'yyyy-MM-dd', new Date());
        const dataFinal = format(dataFormatada, 'dd/MM/yyyy');

        return dataFinal;
    } catch (error: any) {
        throw new Error('Erro ao converter a data');
    }
}

export function converterFormatoDataHora(data: string): string {
    try {
        const dataObj = new Date(data);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        };

        return dataObj.toLocaleString('pt-BR', options);
    } catch (error) {
        throw new Error('Erro ao converter a data');
    }
}
