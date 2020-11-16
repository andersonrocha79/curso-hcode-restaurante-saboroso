// os 'forms' da página são
// elementos que herdam do elemento pai 'HTMLFormElement'
// para ver isso só acessar o console e pesquisar pelo elemento
// dir(document.querySelector("form"))

// vamos incluir o método 'save'
// no elemento pai, para que todo 'form' tenha o método 'save' por padrão
HTMLFormElement.prototype.save = function(config)
{

    // faz referência ao form atual
    let form = this;

    form.addEventListener('submit', e =>
    {
    
        // cancela o comportamento padrão
        e.preventDefault();
    
        let formData = new FormData(form);
        
        console.log("enviou formulário > ", formData );
    
        fetch(form.action,
        {
            method: form.method,
            body: formData
        })
        .then(response => response.json()).then(json =>
        {
            if (json.error)
            {
                if (typeof config.failure === 'function') config.failure(json.error);
            }
            else
            {
                console.log("enviou formulário > sucesso > ", json );
                if (typeof config.success === 'function') config.success(json);
            }
        }).catch(err =>
        {
            console.log("enviou formulário > erro > ", err );
            if (typeof config.failure === 'function') config.failure(err);
        }); 
    
    });    

}