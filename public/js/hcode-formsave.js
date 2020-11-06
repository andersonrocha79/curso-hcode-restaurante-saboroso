// os 'forms' da página são
// elementos que herdam do elemento pai 'HTMLFormElement'
// para ver isso só acessar o console e pesquisar pelo elemento
// dir(document.querySelector("form"))

// vamos incluir o método 'save'
// no elemento pai, para que todo 'form' tenha o método 'save' por padrão
HTMLFormElement.prototype.save = function()
{

    // faz referência ao form atual
    let form = this;

    return new Promise((resolve, reject) =>
    {

        form.addEventListener('submit', e =>
        {
     
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
               console.log("enviou formulário > sucesso > ", json );
               resolve(json);
           }).catch(error =>
           {
                console.log("enviou formulário > erro > ", error );
                reject(error);
           });
     
        });    

    });

}