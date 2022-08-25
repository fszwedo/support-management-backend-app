export interface leadgenFormContent {
    advisorName: string,
    submittedFormData: {
        questionId: number,
        questionText: string,
        answers: string[]
    }[],
    questionsFlow:{
        questionId: number,
        questionText: string,
        answers: string[]
    }[]
}
