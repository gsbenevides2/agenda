import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  *{
    user-select:none;
  }
  body{
    margin:0;
    padding:0;
    background-color:#212121;
    color:#ffffff;
    font-family: 'Poppins', sans-serif;
  }
  #root{
    width:100%;
    display:flex;
    justify-content:center;
  }
`
