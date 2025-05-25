# Ale Carrari - E-commerce de Bolsas e Acessórios de Luxo (Frontend)

## Descrição

Este é um projeto frontend que simula um site de e-commerce para a marca fictícia "Ale Carrari", especializada na venda de bolsas e acessórios de luxo. Foi desenvolvido como parte de um trabalho acadêmico para demonstrar as funcionalidades e a interface de uma loja virtual moderna, com foco na experiência do usuário e design elegante.

## Funcionalidades Implementadas

* **Página Inicial (`index.html`):**
    * Banner de destaque personalizável.
    * Listagem de produtos carregados dinamicamente.
    * Barra de pesquisa para encontrar produtos por nome ou descrição.
    * Filtros de categoria (acionados pelo menu lateral) e atributos (como "couro", "tecido", etc.).
* **Página de Detalhes do Produto (`product-details.html`):**
    * Exibição dinâmica da imagem do produto, nome, preço e descrição detalhada.
    * Seção de avaliações de clientes (simuladas e carregadas dinamicamente).
    * Botões "Adicionar ao Carrinho" e "Comprar Agora".
* **Carrinho de Compras (`cart.html`):**
    * Visualização dos itens adicionados, com imagem, nome e preço.
    * Opção de aumentar ou diminuir a quantidade dos itens.
    * Opção de remover itens individualmente do carrinho.
    * Cálculo do subtotal e total (com frete simulado).
* **Checkout Simulado (`checkout.html`):**
    * Processo de finalização de compra em múltiplas etapas:
        1.  Endereço de entrega.
        2.  Seleção da forma de pagamento (simulada).
        3.  Confirmação do pedido.
* **Perfil do Usuário / Cadastro (`profile.html`):**
    * Formulário para cadastro de dados do cliente (nome, e-mail, senha, endereço).
    * Simulação de salvamento de dados usando Local Storage.
* **Interface do Usuário:**
    * Menu lateral navegável e responsivo.
    * Notificações flutuantes (toast notifications) para ações como "adicionar ao carrinho".
    * Design responsivo para adaptação em diferentes tamanhos de tela.
    * Foco em acessibilidade (ex: `aria-label` em botões de ícone).
* **Persistência de Dados (Local):**
    * O carrinho de compras e os dados do perfil (simulados) são salvos no Local Storage do navegador.

## Tecnologias Utilizadas

* HTML5
* CSS3 (com Flexbox e Grid para layout)
* JavaScript (ES6+)

## Como Executar o Projeto Localmente

1.  Clone este repositório ou faça o download dos arquivos.
    ```bash
    git clone https://github.com/lucascarrari/Ecomm.git
    cd Ecomm
    ```
2.  Certifique-se de que todas as imagens dos produtos estejam na pasta `/images/` na raiz do projeto, com os nomes corretos conforme especificado no arquivo `script.js`.
3.  Abra o arquivo `index.html` em qualquer navegador web moderno.

## Estrutura dos Arquivos

* `index.html`: Página inicial.
* `product-details.html`: Template para a página de detalhes de cada produto.
* `cart.html`: Página do carrinho de compras.
* `profile.html`: Página de perfil e cadastro.
* `checkout.html`: Página do processo de finalização de compra.
* `style.css`: Folha de estilos principal.
* `script.js`: Arquivo JavaScript para interações e lógica.
* `/images/`: Pasta para as imagens dos produtos e banner (você precisará criar esta pasta e adicionar suas imagens).

## Observações

* Este é um projeto **frontend puro**. Não há integração com backend, banco de dados real, sistema de pagamento real ou envio de e-mails. Todas essas funcionalidades são simuladas no lado do cliente.
* Criado para fins educacionais.

---

## 📱 Contatos

* **Instagram:** <a href="[https://www.instagram.com/lucascarrari/](https://www.instagram.com/lucascarrari/)" target="_blank">@lucascarrari</a>
* **LinkedIn:** <a href="[https://www.linkedin.com/in/lucascarrari/](https://www.linkedin.com/in/lucascarrari/)" target="_blank">lucascarrari</a>
