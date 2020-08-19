import styled from 'styled-components'

import Button from '../../components/Button'

export const Container = styled.div`
  margin-left:12px;
  margin-right:12px;
  width:100%;
  max-width:720px;
`
export const SyncMessage = styled.p`
  background-color:#1565C0;
  color:white;
  text-align:center;
  padding:0.2rem;
`
export const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
`
export const ActivityItem = styled.li`
  user-select:none;
  transition:0.2s;
  padding:10px;
  cursor:pointer;
  &:hover{
    border-radius:1.22rem;
    background-color:#757575;
  }
`
export const ActivityTitle = styled.h5`
  margin-top: 0;
  margin-bottom: 0.2rem;
  font-size:16px;
`
export const ActivityClassroom = styled.span`
  width:100%;
  display:inline-block;
  font-size:13.28px;
`
export const ActivityDate = styled.span`
  font-size:13.28px;
  font-weight:bold;
`

export const WarningImage = styled.img`
  width:380px;
`
export const WarningMessage = styled.h3`
  text-align:center;
`
export const AddButton = styled(Button)`
  width:70px;
  padding:10px;
  border-radius:50%;
  transform:scale(0.9);

  position:absolute;
  bottom:20px;
  right:20px;
  img{
    width:50px;
    height:50px;
  }
  &:hover{
    transform:scale(1);
  }
`

export const Header = styled.header`
  display:flex;
  justify-content:space-between;
  align-items:center;
  img{
    width:55px;
    height:55px;
    border-radius:50%;
  }
`
