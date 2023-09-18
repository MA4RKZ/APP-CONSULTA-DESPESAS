class Despesa{
 constructor(ano,mes,dia,tipo,descricao,valor){
 	this.ano = ano
 	this.mes = mes
 	this.dia = dia
 	this.tipo = tipo
 	this.descricao = descricao
 	this.valor = valor
 }

    validarDados(){
      for(let i in this){
      	if(this[i] == undefined || this[i] == '' ||  this[i] == null){
      		return false
      	}
      }
      return true
    }
}

class BD{
	constructor(){
		let id = localStorage.getItem('id')

		if(id === null){
			localStorage.setItem('id', 0)
		}
	}

	getNextID(){
      let nextId = localStorage.getItem('id')
      return parseInt(nextId) + 1
	}

	Gravar(d){
    
    let id = this.getNextID()

    localStorage.setItem(id, JSON.stringify(d))

    localStorage.setItem('id',id)
    }

    recoverData(){

     let despesas = Array()

     let id = localStorage.getItem('id')
     
     for(let i = 1; i <= id; i++){
     	let despesa = JSON.parse(localStorage.getItem(i))
        
        if(despesa == null){
        	continue 
        }
        despesa.id = i
     	despesas.push(despesa)
     }
       return despesas
    }

    pesquisar(despesa){
      let despesasFilters = Array()

      despesasFilters = this.recoverData()
      
      console.log(despesa)
      console.log(despesasFilters)
      
      
      if(despesa.ano != ''){
        despesasFilters = despesasFilters.filter(d => d.ano == despesa.ano)
      }

      if(despesa.mes != ''){
        despesasFilters = despesasFilters.filter(d => d.mes == despesa.mes)
      }

      if(despesa.dia != ''){
        despesasFilters = despesasFilters.filter(d => d.dia == despesa.dia)
      }

      if(despesa.tipo != ''){
        despesasFilters = despesasFilters.filter(d => d.tipo == despesa.tipo)
      }

      if(despesa.descricao != ''){
        despesasFilters = despesasFilters.filter(d => d.descricao == despesa.descricao)
      }

      if(despesa.valor != ''){
        despesasFilters = despesasFilters(d => d.valor == despesa.valor)
      }
        return despesasFilters
    }

    remove(id){
    	localStorage.removeItem(id)
    }
}

let bd = new BD()

function cadastrarDespesa() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    
    if(despesa.validarDados()){
       bd.Gravar(despesa)
      
       document.getElementById('modal_title').innerHTML = 'Registro Salvo com Sucesso'
       document.getElementById('modal_TitleCor').className = 'modal-header text-success'
       document.getElementById('modal_bd').innerHTML = 'As despesas foram salvas !!!'
       document.getElementById('buton_modal').innerHTML = 'Voltar'
       document.getElementById('buton_modal').className = 'btn btn-success'
       $('#ModalRegistrarDespesa').modal('show')
        
       ano.value = '' 
	   mes.value = ''
	   dia.value = ''
	   tipo.value = ''
	   descricao.value = ''
	   valor.value = ''

    }else{    	
    	document.getElementById('modal_title').innerHTML = 'Erro nos preenchimentos dos registros'
    	 document.getElementById('modal_TitleCor').className = 'modal-header text-danger'
    	document.getElementById('modal_bd').innerHTML = 'Preencha todos os campos obrigátorios !!!'
    	document.getElementById('buton_modal').innerHTML = 'Voltar e preencher'
    	document.getElementById('buton_modal').className = 'btn btn-danger'
        $('#ModalRegistrarDespesa').modal('show')
    }

}

function CarregarDespesas(despesas = Array(), filtro = false) {
     
     if(despesas.length == 0 && filtro == false){
	despesas = bd.recoverData()
}

	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''

	despesas.forEach(function(d) {
        console.log(d)

		//tr
		let linha = listaDespesas.insertRow()

		//td
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		 
         switch(d.tipo){
         case '1': d.tipo = 'Alimentação'
         	break
         case '2': d.tipo = 'Educação'
         	break
         case '3': d.tipo = 'Lazer'
         	break
         case '4': d.tipo = 'Saúde'
         	break
         case '5': d.tipo = 'Transporte'
         	break
          }

        linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		let btn = document.createElement("button")
		btn.className ="btn btn-danger"
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function () {
			let id = this.id.replace('id_despesa_', '')
			
			bd.remove(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)


	})

}

function pesquisarDespesas() {

	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    
    let despesas = bd.pesquisar(despesa)
    
    CarregarDespesas(despesas, true)
}