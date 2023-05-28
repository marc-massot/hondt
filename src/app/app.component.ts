import { Component } from '@angular/core';

interface Partit {
  nom: string,
  vots: number,
  regidors: number,
  votsPendents: number
}
type Inputs = {
  cup: string, 
  erc: string, 
  psc: string 
};
type IInputs = keyof Inputs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inputs: Inputs = {
    cup: "0",
    erc: "0",
    psc: "0",
  };

  nombreRegidors = 7;

  regidors: Partit[] = [];

  ngOnInit() {
    this.inputs = JSON.parse(localStorage.getItem('inputs') || JSON.stringify({
      cup: "0",
      erc: "0",
      psc: "0",
    }));
    this.calcularRegidors();
  }

  calcularRegidors() {
    localStorage.setItem('inputs',JSON.stringify(this.inputs));
    const partits: IInputs[] = Object.keys(this.inputs) as IInputs[];
    let regidors: Partit[] = partits.map((p: IInputs) => { return { 
      nom: p, 
      vots: parseInt(this.inputs[p]), 
      regidors:0,
      votsPendents: 0
    }});
    regidors.sort((a: Partit, b: Partit)=>b.vots-a.vots);
    let quocientAssignacio = -1;
  
    for (let i = 0; i < this.nombreRegidors; i++) {
      let maxQuocient = 0;
      let partitAssignat = -1;

      regidors.forEach((p: Partit,idx: number)=>{
        const quocient = p.vots / (p.regidors + 1);
        if (quocient > maxQuocient) {
          maxQuocient = quocient;
          partitAssignat = idx;
        }
      })
    
      if (partitAssignat>=0) {
        regidors[partitAssignat].regidors++;
        quocientAssignacio = maxQuocient;
      }
    }

    regidors.forEach((p: Partit) => {
      const quocient = p.regidors > 0 ? p.vots / p.regidors : 0;
      const nextQuocient = p.vots / (p.regidors+1);
      if (quocient != quocientAssignacio) {
        p.votsPendents = Math.ceil((quocientAssignacio==nextQuocient? 0.1 : (quocientAssignacio-nextQuocient))*(p.regidors+1));     
      }
      else {
        p.votsPendents = 0;
      }     
    });
  
    this.regidors = regidors;
    console.log(this.regidors);
  }

  plus (partit: IInputs) {
    this.inputs[partit] = (parseInt(this.inputs[partit])+1).toString();
    this.calcularRegidors();
  }
  
  minus (partit: IInputs) {
    this.inputs[partit] = (Math.max(parseInt(this.inputs[partit])-1,0)).toString();
    this.calcularRegidors();
  }
  
  getPartit(partit: string): Partit | undefined {
    return this.regidors.find(p=>p.nom==partit);
  }
}
