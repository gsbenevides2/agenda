import styled from 'styled-components'

export const Container = styled.div`
  display:flex;
  justify-content:center;
  flex-direction:column;
  margin:1.29rem;
  max-width:720px;
  text-align:center;
  @media(min-width:800px){
    display:grid;
    grid-template-columns:1fr 2fr;
    grid-template-areas: 
    "hero div"
    "footer footer"
  }
`
export const HeroImage = styled.img`
  width:90%;
  grid-area:hero;
`
export const Footer = styled.footer`
  margin-top:0.75rem;
  grid-area:footer;
`
