const { query } = require("./db");
let conn = require("./db");

class Pagination
{

    constructor(query, params = [], itensperPage = 10)
    {
        this.query        = query;
        this.params       = params;
        this.itensperPage = itensperPage;
        this.currentPage  = 1;
    }

    getPage(page)
    {

        this.currentPage = page-1;

        // adiciona mais elementos no 'array'
        this.params.push(
            this.currentPage * this.itensperPage,
            this.itensperPage
        );

        return new Promise((resolve, reject) =>
        {

            // executa multiplos comandos
            // executa o comando normal, e já executa o comando para armazenar
            // quantos registros totais foram selecionados (sem o limit)
            conn.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params, (err, results) =>
            {
         
               if (err)
               {
                  reject(err);
               }
               else
               {
                   // retorna um objeto
                   // results é um array com 2 resultados
                   // 0 - dados retornados
                   // 1 - total de registros 
                   this.data       = results[0];
                   this.total      = results[1][0].FOUND_ROWS;
                   this.totalPages = Math.ceil(this.total / this.itensperPage); // arredonda sempre para o próximo inteiro > 10,2 gera 11
                   this.currentPage++;

                   resolve(this.data);
               }
         
            });            

        });        
    }

    getTotal()
    {
        return this.total;
    }

    getCurrentPage()
    {
        return this.currentPage;
    }

    getTotalPages()
    {
        return this.totalPages;
    }

    getNavigation(params)
    {

        let limitPagesNav = 5;
        let links         = [];
        let nrStart       = 0;
        let nrEnd         = 0; 

        if (this.getTotalPages() < limitPagesNav)
        {
            limitPagesNav = this.getTotalPages();
        }

        // verifica se estamos nas primeiras páginas
        if ((this.getCurrentPage() - parseInt(limitPagesNav/2)) < 1)
        {
            nrStart = 1;
            nrEnd   = limitPagesNav;
        }
        // verifica se está chegando nas últimas páginas
        else if ((this.getCurrentPage() + parseInt(limitPagesNav/2)) > this.getTotalPages())
        {
            nrStart = this.getTotalPages() - limitPagesNav;
            nrEnd   = this.getTotalPages();
        }
        // está no meio da navegação
        else
        {
            nrStart = this.getCurrentPage() - parseInt(limitPagesNav/2);
            nrEnd   = this.getCurrentPage() + parseInt(limitPagesNav/2);
        }

        // verifica se tem botao anterior
        if (this.getCurrentPage() > 1)
        {
            links.push({
                text: '<',
                href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage()-1}))
            });
        }

        // inclui os links para os botões da navegação
        for (let x = nrStart; x <= nrEnd; x++)
        {
            links.push({
                text: x,
                href: '?' + this.getQueryString(Object.assign({}, params, {page:x})),
                active: (x === this.getCurrentPage())
            });
        }

        // verifica se tem botao próximo
        if (this.getCurrentPage() < this.getTotalPages())
        {
            links.push({
                text: '>',
                href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage()+1}))
            });
        }        

        return links;

    }

    getQueryString(params)
    {

        let queryString = [];

        for (let name in params)
        {
            queryString.push(`${name}=${params[name]}`);
        }

        return queryString.join("&");

    }


}

module.exports = Pagination