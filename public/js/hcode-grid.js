class HCodeGrid
{

    constructor(configs)
    {

        // inicia o 'configs' que os listeners proque tem 'objetos filhos'
        configs.listeners = Object.assign(
        {

            afterUpdateClick : (e) =>
            {
                // após preencher os campos do formulário - exibe o modal
                $('#modal-update').modal('show');
            },
            afterDeleteClick : (e) =>
            {
                window.location.reload();
            },
            afterFormCreate : (e) =>
            {
                window.location.reload();
            },
            afterFormUpdate : (e) =>
            {
                window.location.reload();
            },
            afterFormCreateError : (e) =>
            {
                alert('Não foi possível enviar o formulário de inclusão');
            },
            afterFormUpdateError : (e) =>
            {
                alert('Não foi possível enviar o formulário de alteração');
            }            

        },
        configs.listeners);

        // gera o objeto 'options'
        // unificando o objeto 'configs'
        // com as opções passadas no parametro
        this.options =  Object.assign({},
                        {
                            formCreate : "#modal-create form",
                            formUpdate : "#modal-update form",
                            btnUpdate  : "btn-update",
                            btnDelete  : "btn-delete"   ,
                            onUpdateLoad : (form, name, data) =>
                            {
                                let input = form.querySelector('[name='+name+']');
                                if (input) input.value = data[name];
                            }
                        },
                        configs);       
                        
        // busca todas as linhas da tabela
        // utiliza o spread para converter em array
        this.rows       = [...document.querySelectorAll('table tbody tr')];

        // configura os formulários para 'inclusão' e 'alteração'
        this.initForms();

        // configura os botões de 'excluir' e 'editar'
        this.initButtons();     

    }

    fireEvent(name, args)
    {

        // verifica se foi definida uma função para o evento
        if (typeof this.options.listeners[name] === 'function')
        {
            // faz a execução do evento pelo 'nome' da função
            this.options.listeners[name].apply(this, args);;
        }

    }

    initForms()
    {

        // faz referência ao formulário 'modal' de inclusão
        this.formCreate = document.querySelector(this.options.formCreate);                              


        // método para 'salvar' os dados do formulário
        // método save incluído nos elementos 'form'
        // a partir do prototype
        // arquivo public\js\hcode-formsave

        // verifica se existe botão 'novo'
        if (this.formCreate)
        {
    
            this.formCreate.save(
            {
                success: () =>
                {
                    // se o envio do formulário de 'sucesso' 
                    // força a atualização da página no final
                    console.log("registro incluído");
                    // window.location.href = window.location.href;
                    // dispara o evento
                    this.fireEvent("afterFormCreate");
                },
                failure: () =>
                {
                    // se der erro, mostra no log por enquanto
                    this.fireEvent("afterFormCreateError");
                }
            });
        }


        // faz referência ao formulário 'modal' de edição
        this.formUpdate = document.querySelector(this.options.formUpdate);

        // verifica se existe botão 'editar'
        if (this.formUpdate)
        {
        
            this.formUpdate.save(
            {
                success: () =>
                {
                    // se o envio do formulário de 'sucesso' 
                    // força a atualização da página no final
                    console.log("registro alterado");
                    this.fireEvent("afterFormUpdate");
                    //window.location.href = window.location.href;
                },
                failure: () =>
                {
                    // se der erro, mostra no log por enquanto
                    this.fireEvent("afterFormUpdateError");
                }
            });
        }

    }

    getTrData(e)
    {

        // procura no array que tem a lista
        // de elementos pais do item atual
        // retorna o elemento pai que seja uma 'TR'
        let tr = e.path.find(el =>
        {
            return (el.tagName.toUpperCase() === 'TR');
        });

        return JSON.parse(tr.dataset.row);

    }

    btnUpdateClick(e)
    {

        // executa o evento na tela que utiliza o componente
        // this.options.listeners.beforeUpdateClick(e);
        this.fireEvent('beforeUpdateClick', [e]);

        // retorna os dados do 'tr' clicado
        let data = this.getTrData(e);

        // percorre os campos do json         
        for (let name in data)
        {

            // executa o evento
            this.options.onUpdateLoad(this.formUpdate, name, data);
                            
        }    

        // executa o evento na tela que utiliza o componente
        // this.options.listeners.afterUpdateClick(e);
        this.fireEvent('afterUpdateClick', [e]);

    }

    btnDeleteClick(e)
    {

        this.fireEvent("beforeDeleteClick");
        
        // procura no array que tem a lista
        // de elementos pais do item atual
        // retorna o elemento pai que seja uma 'TR'
        let data = this.getTrData(e);

        console.log("registro para exclusão", data.id);
        
        // pede confirmação ao usúario
        if (confirm(eval('`' + this.options.deleteMsg + '`')))
        {

            console.log("exclusão: ", this.options.deleteUrl);

            // faz a chamada 'ajax' para execução do comando no servidor
            fetch(eval('`' + this.options.deleteUrl + '`'),
            {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(json => 
            {
                // excuta o evento
                this.fireEvent("afterDeleteClick");                    
            });

        }
            
    }

    initButtons()
    {    

        // procura todos os 'botões' da linha
        this.rows.forEach(row =>
        {
            // utiliza o spread e faz o forEach percorrendo os botões encontrados
            [...row.querySelectorAll('.btn')].forEach(btn =>
            {

                btn.addEventListener('click', e =>
                {
                
                    if (e.target.classList.contains(this.options.btnUpdate))
                    {
                        this.btnUpdateClick(e);
                    }
                    else if (e.target.classList.contains(this.options.btnDelete))
                    {
                        this.btnDeleteClick(e);
                    }
                    else
                    {
                        this.fireEvent('buttonClick', [e.target, this.getTrData(e), e])
                    }

                });                   

            });
        });
    
    }

}