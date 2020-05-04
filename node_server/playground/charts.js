charts = [
    {
        'val_loss':.5,
        'train_loss':.7,
        'dtype':'float'
    },
    {
        'val_accuracy':.7,
        'train_acrruacy':.9,
        'dtype':'float'
    }
]

for(var chart of charts){
    for(var attr in chart){
        console.log(attr)
    }
}