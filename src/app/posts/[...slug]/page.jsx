import React from 'react'

const page = async({params}) => {
    const {slug} = await params;
    if (!slug || slug.length === 0) {
        return null;
    }
    const statusId = slug[0];

  return (
    <div>
        statusId : {statusId}
    </div>
  )
}

export default page
