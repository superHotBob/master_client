import Menu_icon from '@/components/icons/menu'
import styles from './display.module.css'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then(res => res.json())
import { url, my_data } from '@/data.'
import { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useEffect } from 'react'



export default function DisplayPublications() {
    const { color = my_data.my_tema[0].color, nikname } = useSelector(state => state.counter.profile)
    const router = useRouter()
    const [images, setImages] = useState()
    // const { data, mutate } = useSWR(`/api/get_images?nikname=${nikname}`, fetcher)
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    useEffect(() => {
        fetch(`/api/get_images?nikname=${nikname}`)
            .then(res => res.json())
            .then(res => setImages(res))
    }, [])
    function onDragEnd(result) {
        // let new_images = images.filter(i=>i.id !== result.source.index)
        // setImages(new_images)
        // console.log(images)
        // dropped outside the list
        if (!result.destination) {
            // console.log(result.destination, result.source.index)
            // let new_images = images.filter((i,index)=>index != result.source.index)
            // setImages(new_images)
            return;
        }
        // console.log( result.source.index,result.destination.index)
        // const new_images = reorder(
        //     images,
        //     result.source.index,
        //     result.destination.index
        // );
        // setImages(new_images)

    }
    function onDragUpdate(result) {
        console.log(result.source.index)
            let new_images = images.filter((i,index)=>i.id !== result.source.index)
            setImages(new_images)
            console.log(images)
           
      
    }
    return (
        <main>
            <header className={styles.header}>
                <div
                    onClick={() => router.back()}
                    className={styles.left__arrow}

                >
                    <Menu_icon color={color[1]} />
                </div>
                <span>Показ публицаций</span>
                <span style={{ color: color[1] }}>Принять</span>
            </header>
            <section>
                <p className={styles.text}>
                    {`Вы можете выбрать порядок публикаций. 
                    Перетаксикайте публикации зажатием.`}
                </p>
            </section>
            <div className={styles.images}>
                {images?.length}
                <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (<>
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >

                                {images?.filter((i, my_index) => my_index % 2 != 0).map((i, index) =>


                                    <Draggable key={i.id + 'v'} draggableId={i.id + ''} index={i.id}>
                                        {(provided, snapshot) => (
                                           
                                            <img
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}

                                                key={i.id}
                                                alt={i.nikname} src={url + '/var/data/' + i.nikname + '/' + i.id + '.jpg'} />
                                            
                                            
                                        )}
                                    </Draggable>


                                )}
                             {provided.placeholder}    
                            </div>
                            <div

                                ref={provided.innerRef}
                            >

                                {images?.filter((i, my_index) => my_index % 2 === 0).map((i, index) =>


                                    <Draggable key={i.id + 'v'} draggableId={i.id + ''} index={i.id}>
                                        {(provided, snapshot) => (
                                            <img
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}

                                                key={i.id}
                                                alt={i.nikname} src={url + '/var/data/' + i.nikname + '/' + i.id + '.jpg'} />
                                        )}
                                    </Draggable>


                                )}
                                {provided.placeholder}
                            </div>
                        </>
                        )}
                       
                    </Droppable>
                </DragDropContext>

                {/* <div>
                    {images?.filter((i, index) => index % 2 === 0).map(i =>
                        <img onClick={() => Movie(i)} key={i.id} alt={i.nikname} src={url + '/var/data/' + i.nikname + '/' + i.id + '.jpg'} />)}
                </div> */}
            </div>
           

        </main>
    )
}