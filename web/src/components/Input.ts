import styled from 'styled-components'

export default styled.input`
  padding:0;
  height:17.5px;
  margin-left:10px;
  background-color:transparent;
  color:white;
  width:100%;
  font-size:15px;
  border:none;
  box-sizing:border-box;
  outline:none;
`

export const Label = styled.label`
  font-size:15px;
  color:grey;
  margin-left:5px;
  transition:0.8s;
`
export const InputBlock = styled.div`
  padding:10px;
  border: 1px solid grey;
  margin-bottom:5px;
  transition:0.2s;
  &:focus-within,
  &:hover{
    border-radius:0.9rem;
    border-color:#90caf9;
    label{
      color:#90caf9;
    }
  }
`
