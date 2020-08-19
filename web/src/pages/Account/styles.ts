import styled from 'styled-components'

export const Container = styled.div`
  margin-top:12px;
  margin-left:12px;
  margin-right:12px;
  width:100%;
  max-width:720px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:12px;
  button {
    width:90%;
  }
`
export const Image = styled.img`
  border-radius:50%;
  width:250px;
  height:250px;
`
export const Name = styled.h2`
  margin-bottom:0px;
`
export const Email = styled.h4`
  margin-top:0px;
`
