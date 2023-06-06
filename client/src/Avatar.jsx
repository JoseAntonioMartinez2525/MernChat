export default function Avatar({userId,username}) {
      const colors = ['bg-teal-200', 'bg-red-200',
                  'bg-green-200', 'bg-purple-200',
                  'bg-blue-200', 'bg-yellow-200',
                  'bg-orange-200', 'bg-pink-200', 'bg-fuchsia-200', 'bg-rose-200'];
       const userIdBase10 = parseInt(userId.substring(10), 16);            
  return(
    <div className="w-8 h-8 bg-red-200 rounded-full flex items-center">
       <div className="text-center w-full">{
       username[0]}
        </div>
    </div> 
  );
}