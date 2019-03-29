 export class EventModel {
   /* basic features*/
   event_duration: string;

   event_date_range: string;
   event_rolling_days: string;
 /*  event_date_ranges: string;*/
   event_infinite: string;

   event_time_zone_local : string;
  /* event_time_zone_locked : string;*/

   event_availability_start_hours: string;
   event_availability_end_hours: string;
   event_current_date: string;

   /*Advanced Features*/
   event_availability_increments : string;
   event_max_per_day : string;
   event_scheduling_notice: string;
   event_buffer_before_event: string;
   event_buffer_after_event: string;

   event_secret :string;

   constructor ( event_duration: string,
                 event_date_range: string,

                 event_rolling_days: string,
                /* event_date_ranges: string,*/
                 event_infinite: string,

                 event_time_zone_local : string,

                 event_availability_start_hours: string,
                 event_availability_end_hours: string,
                 event_current_date: string,

                 event_availability_increments : string,
                 event_max_per_day : string,
                 event_scheduling_notice: string,
                 event_buffer_before_event: string,
                 event_buffer_after_event: string,

                 event_secret :string
                 ) {
       this.event_duration = event_duration;
       this.event_date_range = event_date_range;
       this.event_rolling_days = event_rolling_days;
   /*    this.event_date_ranges = event_date_ranges;*/
       this.event_infinite = event_infinite;
       this.event_time_zone_local = event_time_zone_local;

       this.event_availability_start_hours = event_availability_start_hours;
       this.event_availability_end_hours = event_availability_end_hours;
       this.event_current_date = event_current_date;
       this.event_availability_increments = event_availability_increments;
       this.event_max_per_day = event_max_per_day;
       this.event_scheduling_notice = event_scheduling_notice;
       this.event_buffer_before_event = event_buffer_before_event;
       this.event_buffer_after_event = event_buffer_after_event;
       this.event_secret = event_secret;
   }
 }
