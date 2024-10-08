import React, { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
    SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"

import { Calendar } from "@/components/ui/calendar"
import { Button } from '@/components/ui/button';
import GlobalApi from '@/app/_services/GlobalApi';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import moment from 'moment';


function BookingSection({ children, business }) {
    const [date, setDate] = useState(new Date())
    const [timeSlot, setTimeSlot] = useState([]);
    const [selectedTime, setSelectedTime] = useState();
    const [bookedSlot, setBookedSlot] = useState([]);
    const { data } = useSession();
    
    useEffect(() => {
        getTime();
        
    }, [])
    
    useEffect(() => {
        date&&BusinessBookedSlot();
    },[date])

    // Get Selected Date Business Booked Slot
    const BusinessBookedSlot = () =>{
        GlobalApi.BusinessBookedSlot(business.id,moment(date).format('DD-MMM-YYYY')).then((res) => { 
            console.log(res);
            setBookedSlot(res.bookings);
        })
    }

    const getTime = () => {
        const timeList = [];
        for (let i = 10; i <= 12; i++){
            timeList.push({
                time: i+':00 AM'
            })
            timeList.push({
                time: i+':30 AM'
            })
        }
        for (let i = 1; i <= 6; i++){
            timeList.push({
                time: i+':00 PM'
            })
            timeList.push({
                time: i+':30 PM'
            })
        }
        setTimeSlot(timeList);
    }
    const saveBooking = () => { 
        GlobalApi.createNewBooking(business.id,
            moment(date).format('DD-MMM-YYYY'), selectedTime, data?.user?.email, data?.user?.name).then((res) => {
            console.log(res)
            if (res) {
                setDate();
                setSelectedTime('')
                toast('Service Booked Successfully')
                //Toast message
            }
        }, (e) => {
            toast('Error while creating booking')
            //Error Toast message
        })
    }

    const isSlotBooked = (time) => {
        return bookedSlot.find(item=>item.time == time)
    }
  return (
    <div className='text-white'>
          
          <Sheet>
  <SheetTrigger asChild>{children}</SheetTrigger>
  <SheetContent className="overflow-auto">
    <SheetHeader>
      <SheetTitle className='text-white'>Book an Service</SheetTitle>
      <SheetDescription className='text-white'>
                          Select date and time slot to book an service
                          {/* Date Picker section */}
                          <div className='flex flex-col gap-5 items-baseline text-white'>
                              <h2 className='mt-5 font-bold'>Select Date</h2>
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                          </div>
                          {/* Time Slot picker */}
                          <h2 className='text-white my-5 font-bold'>Select Time Slot</h2>
                          <div className='grid grid-cols-3 gap-4 text-white'>
                              {timeSlot.map((item, index) => (
                                  <Button key={index}
                                  disabled={isSlotBooked(item.time)}    variant={'outline'}
                                  className={`border rounded-full px-3 p-2 hover:bg-primary hover:text-white ${selectedTime === item.time ? 'bg-primary text-white' : ''}`} onClick={() => setSelectedTime(item.time)}>{item.time}</Button>
                              ))}
                          </div>
      </SheetDescription>
                  </SheetHeader>
                   <SheetFooter className='flex justify-center w-full'>
              <SheetClose asChild>
                          <div className='flex gap-5 mt-5 w-full justify-between'>
                              <Button variant={'destructive'} className='rounded-full text-white w-1/2'>Cancel</Button>
                <Button className='rounded-full w-1/2' disabled={!(selectedTime&&date)} onClick={()=>saveBooking()}>Book</Button>
                </div>
              </SheetClose>
            </SheetFooter>
  </SheetContent>
</Sheet>

    </div>
  )
}

export default BookingSection
