 interface ticket { 
    id:number,
    type:string,
    subject:string
    description:string,
    level:'L1' | 'L2' | 'other' | 'any'
  }; 

  export default ticket;

